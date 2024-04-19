"use client";
import React, { useState, useEffect } from "react";
import { HoverEffect } from "../components/ui/card-hover-effect";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import Link from "next/link";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

interface Project {
  title: string;
  description: string;
  link: string;
  tag: string;
}

// interface Props {
//   projects: Project[];
// }
interface Items {
  id: string;
  title: string;
  link: string;
  tag: string;
  description: string;
  user_id: string;
  sold: boolean;
}

interface Props {
  projects: Items[];
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [users, setUsers] = useState<Items[]>([]);

  useEffect(() => {
    async function fetchItems() {
      const querySnapshot = await getDocs(collection(db, "Item"));
      const usersData: Items[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });

      const filteredItems = usersData.filter((item) => item.sold === false);

      setUsers(filteredItems);
    }

    fetchItems();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <TypewriterEffectSmoothDemo />
        <br></br>
        <br></br>
        <br></br>
        <CardHoverEffectDemo projects={users} />
      </div>
    </div>
  );
}

function CardHoverEffectDemo({ projects }: Props) {
  return (
    <div>
      <div className="max-w-5xl mx-auto px-8">
        <HoverEffect items={projects} />
      </div>
    </div>
  );
}
function TypewriterEffectSmoothDemo() {
  // A web-based service to trade items with security
  const { user } = useAuth();

  const words = [
    {
      text: "A",
    },
    {
      text: "web-based",
    },
    {
      text: "service",
    },
    {
      text: "to",
    },
    {
      text: "trade",
    },
    {
      text: "items",
    },
    {
      text: "with",
    },
    {
      text: "security.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
        Temple Trading Hub
      </p>
      <TypewriterEffectSmooth words={words} />
      {user ? ( // If user is logged in, render profile button
        <Link href={"/profile"}>
          <button className="w-40 h-10 rounded-xl bg-black text-white border dark:border-white border-transparent text-sm hover:bg-white hover:text-black">
            Profile
          </button>
        </Link>
      ) : (
        // If user is not logged in, render sign up and log in buttons
        <div className="flex">
          <Link href={"/signup"}>
            <button className="w-40 h-10 rounded-xl bg-black text-white border dark:border-white border-transparent text-sm hover:bg-white hover:text-black mr-2">
              Sign Up
            </button>
          </Link>
          <Link href={"/login"}>
            <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm hover:bg-black hover:text-white hover:border-white">
              Log In
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

import { User } from "firebase/auth"; // Import User type from firebase authentication module

function useAuth() {
  const [user, setUser] = useState<User | null>(null); // Specify the type as User | null

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return { user };
}
