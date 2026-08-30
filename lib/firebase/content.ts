import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./client";

export type AdminProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  proofPoint: string;
  problem: string;
  architecture: string;
  tech: string[];
  highlights: string[];
  github: string;
  demo: string;
  iconKey: string;
  status: "Live" | "Case study" | "Private repo" | "In progress";
  order: number;
};

export type AdminBlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  published: boolean;
};

export type AdminProfile = {
  title: string;
  tagline: string;
  heroDescription: string;
  profilePhoto: string;
};

function assertDb() {
  if (!db) {
    throw new Error("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* values first.");
  }
  return db;
}

function cleanList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function projectFromDoc(data: DocumentData, id: string): AdminProject {
  return {
    id,
    title: data.title || "",
    category: data.category || "",
    description: data.description || "",
    proofPoint: data.proofPoint || "",
    problem: data.problem || "",
    architecture: data.architecture || "",
    tech: cleanList(data.tech),
    highlights: cleanList(data.highlights),
    github: data.github || "",
    demo: data.demo || "",
    iconKey: data.iconKey || "Code2",
    status: data.status || "Case study",
    order: Number(data.order || 0),
  };
}

export function blogPostFromDoc(data: DocumentData, slug: string): AdminBlogPost {
  return {
    slug,
    title: data.title || "",
    date: data.date || new Date().toISOString().slice(0, 10),
    description: data.description || "",
    tags: cleanList(data.tags),
    content: data.content || "",
    published: Boolean(data.published),
  };
}

export async function listProjects() {
  const database = assertDb();
  const snapshot = await getDocs(query(collection(database, "projects"), orderBy("order", "asc")));
  return snapshot.docs.map((item) => projectFromDoc(item.data(), item.id));
}

export async function saveProject(project: AdminProject) {
  const database = assertDb();
  await setDoc(
    doc(database, "projects", project.id),
    {
      ...project,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function deleteProject(id: string) {
  const database = assertDb();
  await deleteDoc(doc(database, "projects", id));
}

export async function listBlogPosts(onlyPublished = false) {
  const database = assertDb();
  const snapshot = await getDocs(query(collection(database, "blogPosts"), orderBy("date", "desc")));
  return snapshot.docs
    .map((item) => blogPostFromDoc(item.data(), item.id))
    .filter((post) => !onlyPublished || post.published);
}

export async function saveBlogPost(post: AdminBlogPost) {
  const database = assertDb();
  await setDoc(
    doc(database, "blogPosts", post.slug),
    {
      ...post,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function deleteBlogPost(slug: string) {
  const database = assertDb();
  await deleteDoc(doc(database, "blogPosts", slug));
}

export async function saveProfile(profile: AdminProfile) {
  const database = assertDb();
  await setDoc(
    doc(database, "siteSettings", "profile"),
    {
      ...profile,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
