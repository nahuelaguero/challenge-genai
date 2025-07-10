"use client";

import NotebookViewer from "@/components/NotebookViewer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Challenge itti 2025
          </h1>
          <p className="text-xl text-gray-600">
            Prompt Engineering y Arquitectura Cognitiva
          </p>
        </div>

        <NotebookViewer />
      </div>
    </div>
  );
}
