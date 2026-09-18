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

// Legacy Firestore blog posts (`blogPosts/{slug}`), edited in the admin Blog tab.
// Projects, experience and the profile live on the CMS layer in lib/cms.
// The public blog currently renders Markdown files from content/blog.

export type AdminBlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  published: boolean;
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

function blogPostFromDoc(data: DocumentData, slug: string): AdminBlogPost {
  return {
    slug,
    title: typeof data.title === "string" ? data.title : "",
    date: typeof data.date === "string" && data.date ? data.date : new Date().toISOString().slice(0, 10),
    description: typeof data.description === "string" ? data.description : "",
    tags: cleanList(data.tags),
    content: typeof data.content === "string" ? data.content : "",
    published: data.published === true,
  };
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
