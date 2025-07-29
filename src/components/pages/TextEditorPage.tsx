import React from "react";
import { TextEditor } from "../TextEditor";

export function TextEditorPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <TextEditor />
      </div>
    </div>
  );
}
