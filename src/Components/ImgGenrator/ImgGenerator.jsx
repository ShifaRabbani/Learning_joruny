import React, { useState, useRef } from 'react'
import { GoogleGenAI } from '@google/genai'
import './ImgGenerator.css'
import default_image from '../Assets/default_image.svg'

function ImgGenerator() {
  const [img_url, setImg_url] = useState("/");
  const inputRef = useRef(null);

  const generateImage = async () => {
    const prompt = inputRef.current?.value?.trim();

    if (!prompt) {
      alert("Please enter a description for the image.");
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      alert("Gemini API key is missing. Add VITE_GEMINI_API_KEY in your .env file.");
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt,
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find(p => p.inlineData);

      if (imagePart) {
        setImg_url(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
      } else {
        throw new Error("No image data returned from Gemini.");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Image generation failed");
    }
  };

  return (
    <div className='ai-img-generator'>
      <div className='header'>Ai Image <span>Generator</span></div>
      <div className="img-loading">
        <div className="image">
          <img src={img_url === "/" ? default_image : img_url} alt="Generated AI" />
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className='search-input'
          placeholder='Describe what you want to see'
        />
        <div className="generate-btn" onClick={generateImage}>Generate</div>
      </div>
    </div>
  )
}

export default ImgGenerator