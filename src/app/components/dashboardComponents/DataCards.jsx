import React from 'react'

export default function DataCards({data}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-7 flex flex-col justify-center items-center gap-3">
          <p className="text-lg font-semibold text-gray-700">
            {data.title}
          </p>
          <p className="text-2xl font-bold ">{data.count}</p>
        </div>
  )
}
