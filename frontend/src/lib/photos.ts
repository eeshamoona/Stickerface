import { Photo } from "@/types";

// Photos data structure
export const photos: Photo[] = [
  {
    id: "cs-graduation",
    title: "UIUC CS Graduation 2023",
    description: "Right before we got our diplomas",
    type: "art-styles",
    date: "2023-05-15",
    location: "University of Illinois at Urbana-Champaign",
    color: "#13294B", // UIUC blue
    images: {
      original: "/images/photos/art-styles/cs-graduation/original.jpg",
      artStyles: [
        {
          id: "studioghibli",
          name: "Studio Ghibli",
          description: "Inspired by Studio Ghibli's animation style",
          imagePath: "/images/photos/art-styles/cs-graduation/studioghibli.jpg",
        },
        {
          id: "futurama",
          name: "Futurama",
          description: "Inspired by Futurama's animation style",
          imagePath: "/images/photos/art-styles/cs-graduation/futurama.png",
        },
        {
          id: "pixar",
          name: "Pixar",
          description: "Inspired by Pixar's animation style",
          imagePath: "/images/photos/art-styles/cs-graduation/pixar.png",
        },
      ],
    },
    aspectRatio: "4 / 3",
  },
  {
    id: "pulp-fiction-bananas",
    title: "Pulp Fiction Bananas",
    description: "Famous scene from Pulp Fiction",
    type: "art-styles",
    date: "2023-05-15",
    location: "University of Illinois at Urbana-Champaign",
    color: "#13294B", // UIUC blue
    images: {
      original: "/images/photos/art-styles/pulp-fiction-bananas/original.jpg",
      artStyles: [
        {
          id: "studioghibli",
          name: "Studio Ghibli",
          description: "Inspired by Studio Ghibli's animation style",
          imagePath:
            "/images/photos/art-styles/pulp-fiction-bananas/studioghibli2.jpg",
        },
        {
          id: "pixar",
          name: "Pixar",
          description: "Inspired by Pixar's animation style",
          imagePath: "/images/photos/art-styles/pulp-fiction-bananas/pixar.png",
        },
      ],
    },
    aspectRatio: "4 / 3",
  },
  {
    id: "girls-graduation",
    title: "Girls Graduation",
    description: "Eesha and Victoria graduating from UIUC",
    type: "art-styles",
    date: "2023-05-15",
    location: "University of Illinois at Urbana-Champaign",
    color: "#13294B", // UIUC blue
    images: {
      original: "/images/photos/art-styles/girls-graduation/original.jpg",
      artStyles: [
        {
          id: "studioghibli",
          name: "Studio Ghibli",
          description: "Inspired by Studio Ghibli's animation style",
          imagePath:
            "/images/photos/art-styles/girls-graduation/studioghibli.png",
        },
        {
          id: "animated",
          name: "Animated",
          description: "Inspired by general animation styles",
          imagePath: "/images/photos/art-styles/girls-graduation/animated.png",
        },
        {
          id: "funko-pop",
          name: "Funko Pop",
          description: "Inspired by Funko Pop's animation style",
          imagePath: "/images/photos/art-styles/girls-graduation/funkopop.png",
        },
      ],
    },
    aspectRatio: "1 / 1",
  },
];

export const getPhoto = (id: string): Photo | undefined => {
  return photos.find((photo) => photo.id === id);
};
