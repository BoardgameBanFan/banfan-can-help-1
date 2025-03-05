'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function CreateEventPage() {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    startTime: '',
    location1: '',
    location2: '',
    maxAccommodate: 20,
    allowAttendeesAddGames: true,
    voteUntilDate: '',
    games: [
      {
        game: {
          name: '方舟動物園',
          thumbnail:
            'https://cf.geekdo-images.com/SoU8p28Sk1s8MSvoM4N8pQ__thumb/img/4KuHNTWSMPf8vTNDKSRMMI3oOv8=/fit-in/200x150/filters:strip_icc()/pic6293412.jpg',
          description:
            'In Ark Nova, you will plan and design a modern, scientifically managed zoo...',
        },
        add_by: 'Kate',
      },
      {
        game: {
          name: '重塑火星',
          thumbnail:
            'https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__thumb/img/BTxqxgYay5tHJfVoJ2NF5g43_gA=/fit-in/200x150/filters:strip_icc()/pic3536616.jpg',
          description: 'In the 2400s, mankind begins to terraform the planet Mars...',
        },
        add_by: 'Jeff',
      },
    ],
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMaxAccommodateChange = increment => {
    setEventData(prev => ({
      ...prev,
      maxAccommodate: Math.max(1, prev.maxAccommodate + increment),
    }));
  };

  const handleAllowAttendeesAddGamesChange = () => {
    setEventData(prev => ({
      ...prev,
      allowAttendeesAddGames: !prev.allowAttendeesAddGames,
    }));
  };

  const truncateDescription = (description, maxLength = 100) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  return (
    <div id="webcrumbs">
      <div className=" bg-[#f1efe9] p-6 font-sans">
        <h1 className="text-2xl font-bold mb-6">Create Event</h1>

        <div className="space-y-4">
          <div className="border-b border-black">
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              placeholder="Event title"
              className="w-full bg-transparent py-2 focus:outline-none"
            />
          </div>

          <div className="bg-white rounded-md overflow-hidden shadow-sm">
            <div
              className="flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => document.querySelector('input[name="date"]').showPicker()}
            >
              <AccessTimeIcon className="mr-3 text-black" />
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleInputChange}
                placeholder="Date"
                className="w-full bg-transparent focus:outline-none cursor-pointer"
              />
              <KeyboardArrowDownIcon className="text-gray-400" />
            </div>
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center"
              onClick={() => document.querySelector('input[name="startTime"]').showPicker()}
            >
              <input
                type="time"
                name="startTime"
                value={eventData.startTime}
                onChange={handleInputChange}
                placeholder="Start Time"
                className="w-full bg-transparent focus:outline-none cursor-pointer"
              />
              <KeyboardArrowDownIcon className="text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-md overflow-hidden shadow-sm">
            <div className="flex items-center p-4 border-b border-gray-100">
              <LocationOnIcon className="mr-3 text-black" />
              <input
                type="text"
                name="location1"
                value={eventData.location1}
                onChange={handleInputChange}
                placeholder="Location line 1"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            <div className="p-4">
              <input
                type="text"
                name="location2"
                value={eventData.location2}
                onChange={handleInputChange}
                placeholder="Location line 2"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <GroupIcon className="mr-2 text-black" />
              <span>Max accommodate</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleMaxAccommodateChange(-1)}
                className="w-6 h-6 rounded-full bg-transparent border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <RemoveIcon sx={{ fontSize: 16 }} />
              </button>
              <span className="mx-3 text-xl font-bold">{eventData.maxAccommodate}</span>
              <button
                onClick={() => handleMaxAccommodateChange(1)}
                className="w-6 h-6 rounded-full bg-transparent border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <AddIcon sx={{ fontSize: 16 }} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/create-event/new-game"
              className="bg-black text-white py-2 px-4 rounded-md flex items-center justify-center mb-4 hover:bg-gray-800 transition-colors"
            >
              <AddIcon className="mr-1" />
              Add game
            </Link>
            <div>
              <h2 className="font-bold mb-2">Game List</h2>
              <div
                className="flex items-center mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleAllowAttendeesAddGamesChange}
              >
                <div
                  className={`w-5 h-5 border border-gray-400 rounded-sm mr-2 flex items-center justify-center ${eventData.allowAttendeesAddGames ? 'bg-black' : 'bg-white'}`}
                >
                  {eventData.allowAttendeesAddGames && <CheckIcon className="text-white text-sm" />}
                </div>
                <span>Allow attenders add games</span>
              </div>

              <div className="mb-2">
                <p>Vote opened until</p>
                <div className="bg-white rounded-md overflow-hidden shadow-sm mt-1">
                  <div
                    className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      document.querySelector('input[name="voteUntilDate"]').showPicker()
                    }
                  >
                    <AccessTimeIcon className="mr-3 text-black" />
                    <input
                      type="date"
                      name="voteUntilDate"
                      value={eventData.voteUntilDate}
                      onChange={handleInputChange}
                      placeholder="Date"
                      className="w-full bg-transparent focus:outline-none cursor-pointer"
                    />
                    <KeyboardArrowDownIcon className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {eventData.games.map((gameItem, index) => (
                  <div key={index} className="bg-white p-3 rounded-md shadow-sm flex items-start">
                    <img
                      src={gameItem.game.thumbnail}
                      alt={gameItem.game.name}
                      className="w-12 h-12 mr-3 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold">{gameItem.game.name}</span>
                        <span className="text-green-600 hover:underline cursor-pointer transition-all">
                          Edit
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {truncateDescription(gameItem.game.description)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Nominated by {gameItem.add_by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => console.log(eventData)}
            className="w-full bg-[#1e6494] text-white py-3 rounded-full mt-6 hover:bg-[#185380] transition-colors"
          >
            Create event
          </button>
        </div>
      </div>
    </div>
  );
}
