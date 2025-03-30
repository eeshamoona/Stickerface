export interface CharacterConfig {
  slug: string;
  name: string;
  bgColor: string;
  activities: { id: string; label: string; svg: string }[];
  imageSrc: string;
}

// Define a type for the characters object with an index signature
interface CharacterDictionary {
  [key: string]: CharacterConfig;
}
export const getCharacterConfig = (slug: string): CharacterConfig => {
  const characters: CharacterDictionary = {
    capybara: {
      slug: "capybara",
      name: "Capybara",
      bgColor: "#e7fcb9",
      activities: [
        { id: "fish", label: "Fish", svg: "/images/friends/capybara/fish.svg" },
        { id: "bee", label: "Bee", svg: "/images/friends/capybara/bee.svg" },
        {
          id: "pizza",
          label: "Pizza",
          svg: "/images/friends/capybara/pizza.svg",
        },
        { id: "boba", label: "Boba", svg: "/images/friends/capybara/boba.svg" },
      ],
      imageSrc: "/images/friends/capybara/capybara.svg",
    },
    dogchick: {
      slug: "dogchick",
      name: "Dog & Chick",
      bgColor: "#ffd2b2",
      activities: [
        { id: "bone", label: "Bone", svg: "/images/friends/dog/bone.svg" },
        {
          id: "icecream",
          label: "Ice Cream",
          svg: "/images/friends/dog/ice-cream.svg",
        },
        {
          id: "flower",
          label: "Flower",
          svg: "/images/friends/dog/flower.svg",
        },
        {
          id: "fishbowl",
          label: "Fish Bowl",
          svg: "/images/friends/dog/fishbowl.svg",
        },
      ],
      imageSrc: "/images/friends/dog/dogchick.svg",
    },
    bunny: {
      slug: "bunny",
      name: "Bunny",
      bgColor: "#fff9b2",
      activities: [
        {
          id: "carrot",
          label: "Carrot",
          svg: "/images/friends/bunny/carrot.svg",
        },
        {
          id: "donut",
          label: "Donut",
          svg: "/images/friends/bunny/donut.svg",
        },
        {
          id: "easteregg",
          label: "Easter Egg",
          svg: "/images/friends/bunny/easteregg.svg",
        },
        {
          id: "mushroom",
          label: "Mushroom",
          svg: "/images/friends/bunny/mushroom.svg",
        },
      ],
      imageSrc: "/images/friends/bunny/bunny.svg",
    },
    bear: {
      slug: "bear",
      name: "Bear",
      bgColor: "#bdddff",
      activities: [
        { id: "rose", label: "Rose", svg: "/images/friends/bear/rose.svg" },
        { id: "soda", label: "Soda", svg: "/images/friends/bear/soda.svg" },
        {
          id: "butterfly",
          label: "Butterfly",
          svg: "/images/friends/bear/butterfly.svg",
        },
        { id: "scarf", label: "Scarf", svg: "/images/friends/bear/scarf.svg" },
      ],
      imageSrc: "/images/friends/bear/bear.svg",
    },
    // add more friends here
  };

  return characters[slug] ?? characters["capybara"];
};
