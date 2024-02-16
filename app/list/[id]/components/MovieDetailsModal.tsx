"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaArrowUpRightFromSquare,
  FaCircleInfo,
  FaXmark,
} from "react-icons/fa6";

import type { MovieType } from "@/app/types";
import { formatRuntime } from "@/app/utils/format";

type MovieDetailsModalProps = {
  movie: MovieType;
};

export const MovieDetailsModal = ({ movie }: MovieDetailsModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { title, year, genres, image, description, runtime, tagline, imdbId } =
    movie;

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-3 flex w-fit items-center gap-1.5 rounded-full border border-indigo-600 px-3 py-1 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
      >
        <FaCircleInfo className="h-3 w-3" />
        More info
      </button>
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed left-0 top-0 z-20 flex h-screen w-screen justify-center bg-black/70"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 mx-2 mt-24 h-fit w-full max-w-2xl rounded-lg bg-white p-3 shadow-xl sm:p-6 md:mt-56"
          >
            <div className="my-6 flex flex-col items-center">
              <Image
                priority
                width={192}
                height={240}
                alt={title}
                src={`https://image.tmdb.org/t/p/w342${image}`}
                className="w-36 rounded-lg shadow-md md:w-56"
              />
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <h1 className="text-center text-2xl font-bold text-slate-700">
                  {title}
                </h1>
                <p className="mt-0.5 text-lg font-medium text-slate-500">
                  ({year})
                </p>
              </div>
              {!!tagline && (
                <p className="mt-2 text-center text-sm text-slate-600">
                  &quot;{tagline}&quot;
                </p>
              )}
              {!!runtime && (
                <p className="mt-1 text-center text-sm text-slate-600">
                  <span className="font-semibold">Runtime: </span>
                  {formatRuntime(runtime)}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {genres?.map((genre, i) => (
                  <div
                    key={i}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600"
                  >
                    {genre}
                  </div>
                ))}
              </div>
              {!!description && (
                <p className="mt-8 text-justify text-[15px] text-slate-700">
                  {description}
                </p>
              )}
              {imdbId && (
                <Link
                  target="_blank"
                  rel="noreferrer noopener"
                  href={`https://www.imdb.com/title/${imdbId}`}
                  className="mt-8 flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow transition hover:bg-indigo-500"
                >
                  <FaArrowUpRightFromSquare className="h-3 w-3" />
                  View on IMDb
                </Link>
              )}
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-3 top-3"
              aria-label="close"
            >
              <FaXmark className="h-7 w-7 text-slate-600 transition hover:text-slate-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
