// Example usage in a page (e.g., src/pages/index.tsx)
import ImageComparisonSlider from "@/components/photos/ImageComparisonSlider";

// Import your images (or use URLs)
import afterImage from "../../../public/images/photos/after.jpg";
import beforeImage from "../../../public/images/photos/before.jpg";

export default function HomePage() {
  return (
    <div>
      <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
        <ImageComparisonSlider
          imageBefore={beforeImage}
          imageAfter={afterImage}
          altBefore="Description of the 'before' state"
          altAfter="Description of the 'after' state"
          aspectRatio="4 / 3"
        />
        <div className="text-center mt-4 font-sans">
          <p className="text-lg font-medium">
            UIUC Graduation 2023 - The CS Majors
          </p>
        </div>
      </div>
    </div>
  );
}
