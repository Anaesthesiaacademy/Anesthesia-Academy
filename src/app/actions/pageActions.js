"use server";
import { getServerSession } from "next-auth";
import axios from "axios";
import { authOptions } from "../api/auth/[...nextauth]/route";
import connectToDatabase from "../lib/connectToDb";
import Course from "../models/Course";
import clientPromise from "../lib/mongoClient";
import Order from "../models/Order";
import { revalidateTag } from "next/cache";
import { deleteFromStorage } from "../lib/deleteFromStorage";
import Video from "../models/Video";
import Hashids from "hashids";
import { addMonths } from "date-fns";

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

// courses

export async function updateCourses() {
  await connectToDatabase();

  const { user } = await getServerSession(authOptions);

  if (user.role !== "admin") {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${CHANNEL_ID}&key=${API_KEY}`
    );

    const youtubePlaylists = response.data.items;

    const storedCourses = await Course.find(
      {},
      "playlistId title description thumbnail count"
    );

    let addedCount = 0;
    let updatedCount = 0;
    let videosCount = 0;

    for (const playlist of youtubePlaylists) {
      const existingCourse = storedCourses.find(
        (course) => course.playlistId === playlist.id
      );

      const response2 = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=id&playlistId=${playlist.id}&key=${API_KEY}&maxResults=1`
      );
      
      const totalVideos = response2.data.pageInfo.totalResults;
            
      if (existingCourse?.count !== totalVideos) {
        await Course.updateOne(
          { playlistId: playlist.id },
          { $set: { count: totalVideos } }
        );
        videosCount++;
      }

      if (existingCourse) {
        if (
          existingCourse.title !== playlist.snippet.title ||
          existingCourse.description !== playlist.snippet.description ||
          existingCourse.thumbnail !== playlist.snippet.thumbnails.medium.url
        ) {
          await Course.updateOne(
            { playlistId: playlist.id },
            {
              $set: {
                title: playlist.snippet.title,
                description: playlist.snippet.description,
                thumbnail: playlist.snippet.thumbnails.medium.url,
              },
            }
          );
          updatedCount++;
        }
      } else {
        await Course.create({
          playlistId: playlist.id,
          title: playlist.snippet.title,
          description: playlist.snippet.description,
          thumbnail: playlist.snippet.thumbnails.medium.url,
          price: 0, // Default price
        });
        addedCount++;
      }
    }

    return {
      success: true,
      message: `✅ ${addedCount} new courses added, 🔄 ${updatedCount} courses updated, 🔄 ${videosCount} videos count updated`,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error updating courses",
    };
  }
}

export async function removeCourses() {
  await connectToDatabase();

  const { user } = await getServerSession(authOptions);

  if (user.role !== "admin") {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${CHANNEL_ID}&key=${API_KEY}`
    );

    const youtubePlaylists = response.data.items;
    const youtubePlaylistIds = youtubePlaylists.map((playlist) => playlist.id);

    const storedCourses = await Course.find({}, "playlistId").lean();;

    const coursesToDelete = storedCourses.filter(
      (course) => !youtubePlaylistIds.includes(course.playlistId)
    );

    if (coursesToDelete.length > 0) {
      
      const { courseIdsToDelete, playlistIdsToDeleteConfirmed } = coursesToDelete.reduce(
        (acc, course) => {
          acc.courseIdsToDelete.push(course._id);
          acc.playlistIdsToDeleteConfirmed.push(course.playlistId);
          return acc;
        },
        { courseIdsToDelete: [], playlistIdsToDeleteConfirmed: [] }
      );
    
      await Course.deleteMany({ playlistId: { $in: playlistIdsToDeleteConfirmed } });
    
      await Order.updateMany(
        { courseId: { $in: courseIdsToDelete } },
        { $set: { status: "deleted" } }
      );
    }


    return {
      success: true,
      message: `${coursesToDelete.length} courses removed.`,
      // removedCourses: coursesToDelete,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error removing courses",
    };
  }
}








// courses

export async function addCourses(data) {
  await connectToDatabase();

  const { user } = await getServerSession(authOptions);

  if (user.role !== "admin") {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {

    const res = await Course.create(data);

    if (!res) {
      return {
        success: false,
        message: "Error create a new course, please try again",
      };
    }

    revalidateTag("course");


    return {
      success: true,
      message: `✅ new course added successfully`,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error updating courses",
    };
  }
}

export async function updateCourse({ courseId, ...data }) {
  const { user } = await getServerSession(authOptions);

  if (user.role !== "admin") {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    await connectToDatabase();
    await Course.updateOne({ _id: courseId }, { $set: data });
    return { success: true, message: "Course updated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error updating course" };
  }
}


export async function removeCourse(courseId) {
  await connectToDatabase();

  const { user } = await getServerSession(authOptions);

  if (user.role !== "admin") {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {

    const { _id, thumbnail } = await Course.findOneAndDelete({ _id: courseId });
    if (!_id) {
      return {
        success: false,
        message: "Error removing video, please try again",
      };
    }

    if (thumbnail?.cloudId) {
      await deleteFromStorage(thumbnail.cloudId);
    }

    revalidateTag("course");
    return {
      success: true,
      message: "Course removed successfully",
    };

  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error removing courses",
    };
  }
}

// video

export async function getVideosById(courseId) {


  const { user } = await getServerSession(authOptions);

  if (!user.role) {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    await connectToDatabase();

    const data = JSON.parse(JSON.stringify(await Video.find({ courseId }, "-__v").lean()));

    if (!data) {
      return {
        success: false,
        message: "Video not found",
      };
    }

    return {
      success: true,
      data,
    };

  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error fetching video",
    };
  }
}



export async function fetchVideosByIdUser({ courseId, userId }) {
  const { user } = await getServerSession(authOptions);

  if (!user || !userId) {
    return {
      success: false,
      message: 'User not authenticated or userId not provided.',
    };
  }

  const hashids = new Hashids(process.env.NEXT_PUBLIC_SECRET_ID, 10);

  const realId = hashids.decodeHex(courseId)


  console.log("realId", realId, "///", process.env.NEXT_PUBLIC_SECRET_ID)

  if (!realId) {
    return {
      success: false,
      message: 'User not authenticated or userId not provided.',
    };
  }

  await connectToDatabase();

  const currentCourse = await Course.findOne({ _id: realId }, { _id: 0, __v: 0 });
  const courseData = JSON.parse(JSON.stringify(currentCourse));

  if (!courseData) {
    return {
      success: false,
      message: 'Course not found.',
    };
  }

  const hasPurchased = await Order.findOne({
    userId,
    courseId: realId,
    status: 'completed',
  });

  if (!hasPurchased && user.role !== 'admin') {
    return {
      success: false,
      message: 'Access denied. Please purchase the course.',
      hasPurchased: false,
      courseData,
    };
  }

  if (hasPurchased) {
    const now = Date.now();
    const expData = addMonths(hasPurchased.createdAt, +3)

    if (expData < now && user.role !== 'admin') {
      await Order.updateOne(
        { _id: hasPurchased._id },
        { $set: { status: 'expired' } }
      );

      return {
        success: false,
        message: 'Access denied. Your subscription to this course has expired.',
        hasPurchased: false,
        courseData,
      };
    }
  }
  try {

    const data = JSON.parse(JSON.stringify(await Video.find({ courseId: realId }, "-__v").lean()));
    if (!data) {
      return {
        success: false,
        message: "Video not found",
      };
    }

    return {
      success: true,
      data,
      courseData,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch videos',
    };
  }
}


export async function addVideo(data) {
  await connectToDatabase();

  const { user } = await getServerSession(authOptions);

  if (user.role !== "admin") {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {

    const res = await Video.create(data);

    if (!res) {
      return {
        success: false,
        message: "Error create a new video, please try again",
      };
    }

    await Course.updateOne(
      { _id: data.courseId },
      { $inc: { count: 1 } }
    )

    return {
      success: true,
      message: `✅ new Video added successfully`,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error adding videos",
    };
  }
}

export async function updateVideo({ videoId, ...data }) {
  const { user } = await getServerSession(authOptions);

  if (user.role !== "admin") {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    await connectToDatabase();
    await Video.updateOne({ _id: videoId }, { $set: data });

    return { success: true, message: "Video updated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error updating video" };
  }
}

export async function removeVideo(videoId, courseId) {
  await connectToDatabase();
  const { user } = await getServerSession(authOptions);

  if (user.role !== "admin") {
    return {
      success: false,
      message: "User not authenticated",
    };
  }
  try {

    const { _id, thumbnail, video } = await Video.findOneAndDelete({ _id: videoId });
    if (!_id) {
      return {
        success: false,
        message: "Error removing video, please try again",
      };
    }

    if (video?.cloudId) {
      await deleteFromStorage(video.cloudId);
    }

    if (thumbnail?.cloudId) {
      await deleteFromStorage(thumbnail.cloudId);
    }

    await Course.updateOne(
      { _id: courseId },
      { $inc: { count: -1 } });

    return {
      success: true,
      message: "Video removed successfully",
    };

  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error removing videos",
    };
  }
}

export async function updatePrice(courseId, newPrice) {
  const { user } = await getServerSession(authOptions);

  if (user.role !== "admin") {
    return {
      success: false,
      message: "User not authenticated",
    };
  }

  try {
    await connectToDatabase();
    await Course.updateOne({ _id: courseId }, { $set: { price: newPrice } });
    return { success: true, message: "Price updated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error updating price" };
  }
}

export async function updateUserData(email, userData) {
  // const { user } = await getServerSession(authOptions);

  // if (user.role !== "admin") {
  //   return {
  //     success: false,
  //     message: "User not authenticated",
  //   };
  // }

  if (!email || !userData || Object.keys(userData).length === 0) {
    return { success: false, message: "No data provided for update" };
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const updatedUser = await db
      .collection("users")
      .updateOne({ email }, { $set: { userData: userData } });

    if (updatedUser.matchedCount === 0) {
      return { success: false, message: "User not found" };
    }

    return { success: true, message: "User data updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Database update failed" };
  }
}