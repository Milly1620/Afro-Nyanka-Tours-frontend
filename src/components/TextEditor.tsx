import React, { useState, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Save,
  Type,
  Palette,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedLesson {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function TextEditor() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [savedLessons, setSavedLessons] = useState<SavedLesson[]>([]);
  const [currentFontSize, setCurrentFontSize] = useState("medium");
  const [currentColor, setCurrentColor] = useState("black");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  // Font size options
  const fontSizes = {
    small: "14px",
    medium: "16px",
    large: "20px",
  };

  // Color options
  const colors = {
    black: "#000000",
    blue: "#2563eb",
    red: "#dc2626",
    green: "#16a34a",
    yellow: "#ca8a04",
  };

  // Load draft from session storage on component mount
  useEffect(() => {
    const savedDraft = sessionStorage.getItem("textEditorDraft");
    const savedTitle = sessionStorage.getItem("textEditorTitle");

    if (savedDraft) {
      setContent(savedDraft);
      if (editorRef.current) {
        editorRef.current.innerHTML = savedDraft;
      }
    }

    if (savedTitle) {
      setTitle(savedTitle);
    }

    // Load saved lessons from localStorage
    const lessons = localStorage.getItem("savedLessons");
    if (lessons) {
      setSavedLessons(JSON.parse(lessons));
    }
  }, []);

  // Auto-save to session storage as user types
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (content.trim() || title.trim()) {
        sessionStorage.setItem("textEditorDraft", content);
        sessionStorage.setItem("textEditorTitle", title);
      }
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [content, title]);

  // Handle content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Execute formatting commands
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  // Apply font size
  const applyFontSize = (size: keyof typeof fontSizes) => {
    setCurrentFontSize(size);
    executeCommand("fontSize", "3");

    // Apply custom font size to selected text
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.fontSize = fontSizes[size];

      try {
        range.surroundContents(span);
      } catch (e) {
        // If selection spans multiple elements, wrap each text node
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
      }

      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Apply color
  const applyColor = (color: keyof typeof colors) => {
    setCurrentColor(color);
    executeCommand("foreColor", colors[color]);
  };

  // Insert numbered list
  const insertNumberedList = () => {
    executeCommand("insertOrderedList");
  };

  // Save lesson permanently
  const saveLesson = () => {
    if (!title.trim()) {
      alert("Please enter a title for your lesson");
      titleRef.current?.focus();
      return;
    }

    if (!content.trim()) {
      alert("Please add some content to your lesson");
      editorRef.current?.focus();
      return;
    }

    setIsSaving(true);

    const newLesson: SavedLesson = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedLessons = [...savedLessons, newLesson];
    setSavedLessons(updatedLessons);
    localStorage.setItem("savedLessons", JSON.stringify(updatedLessons));

    // Clear session storage and reset form
    sessionStorage.removeItem("textEditorDraft");
    sessionStorage.removeItem("textEditorTitle");
    setContent("");
    setTitle("");

    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }

    setLastSaved(new Date().toLocaleTimeString());
    setIsSaving(false);

    alert("Lesson saved successfully!");
  };

  // Load a saved lesson
  const loadLesson = (lesson: SavedLesson) => {
    setTitle(lesson.title);
    setContent(lesson.content);
    if (editorRef.current) {
      editorRef.current.innerHTML = lesson.content;
    }
  };

  // Delete a saved lesson
  const deleteLesson = (id: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      const updatedLessons = savedLessons.filter((lesson) => lesson.id !== id);
      setSavedLessons(updatedLessons);
      localStorage.setItem("savedLessons", JSON.stringify(updatedLessons));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Lesson Editor</h1>
        <p className="text-gray-600">
          Create and format your lessons with our rich text editor
        </p>
      </div>

      {/* Title Input */}
      <div className="mb-4">
        <input
          ref={titleRef}
          type="text"
          placeholder="Enter lesson title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-semibold border-none outline-none bg-gray-50 p-4 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 p-4 rounded-t-lg border-b border-gray-200">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("bold")}
              className="hover:bg-blue-100"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("italic")}
              className="hover:bg-blue-100"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => executeCommand("underline")}
              className="hover:bg-blue-100"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          {/* Font Sizes */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFontSize("small")}
              className={`hover:bg-blue-100 ${
                currentFontSize === "small" ? "bg-blue-200" : ""
              }`}
            >
              <Type className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFontSize("medium")}
              className={`hover:bg-blue-100 ${
                currentFontSize === "medium" ? "bg-blue-200" : ""
              }`}
            >
              <Type className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyFontSize("large")}
              className={`hover:bg-blue-100 ${
                currentFontSize === "large" ? "bg-blue-200" : ""
              }`}
            >
              <Type className="h-5 w-5" />
            </Button>
          </div>

          {/* Colors */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            {Object.entries(colors).map(([colorName, colorValue]) => (
              <Button
                key={colorName}
                variant="outline"
                size="sm"
                onClick={() => applyColor(colorName as keyof typeof colors)}
                className={`hover:bg-gray-100 ${
                  currentColor === colorName ? "ring-2 ring-gray-400" : ""
                }`}
                style={{ backgroundColor: colorValue }}
              >
                <Palette className="h-4 w-4 text-white mix-blend-difference" />
              </Button>
            ))}
          </div>

          {/* Numbering */}
          <div className="border-r border-gray-300 pr-2">
            <Button
              variant="outline"
              size="sm"
              onClick={insertNumberedList}
              className="hover:bg-blue-100"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Save Button */}
          <Button
            onClick={saveLesson}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Lesson"}
          </Button>
        </div>

        {lastSaved && (
          <p className="text-sm text-green-600 mt-2">Last saved: {lastSaved}</p>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        className="min-h-[400px] p-6 border border-gray-200 rounded-b-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
        style={{
          fontSize: fontSizes[currentFontSize as keyof typeof fontSizes],
        }}
        placeholder="Start writing your lesson..."
      />

      {/* Draft Indicator */}
      {(content.trim() || title.trim()) && (
        <p className="text-sm text-orange-600 mt-2 italic">
          Draft auto-saved to session
        </p>
      )}

      {/* Saved Lessons */}
      {savedLessons.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Saved Lessons
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedLessons.map((lesson) => (
              <div key={lesson.id} className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2 truncate">
                  {lesson.title}
                </h3>
                <div
                  className="text-sm text-gray-600 mb-3 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: lesson.content.substring(0, 100) + "...",
                  }}
                />
                <p className="text-xs text-gray-500 mb-3">
                  Created: {new Date(lesson.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadLesson(lesson)}
                    className="flex-1"
                  >
                    Load
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteLesson(lesson.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
