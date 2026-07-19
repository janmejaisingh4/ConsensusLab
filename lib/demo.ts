import type { Provider } from "./types";
export const DEMO_ANSWERS: Record<Provider,string> = {
 openai:"Sunlight looks white, but contains many colors. When it enters the atmosphere, tiny gas molecules scatter short blue wavelengths more strongly than red ones, so blue light reaches our eyes from every direction.",
 claude:"Imagine sunlight as a bundle of colored crayons. Air molecules knock the blue crayons around more easily than the red ones. Wherever you look, some scattered blue light travels toward you, making the sky appear blue.",
 gemini:"This is Rayleigh scattering. Violet scatters even more than blue, but our eyes are less sensitive to violet and some is absorbed, so the combined scattered light looks mainly blue."
};
export const DEMO_SYNTHESIS = "Sunlight may look white, but it contains all the colors of the rainbow. As it passes through the atmosphere, it collides with tiny gas molecules. Shorter wavelengths scatter more strongly, so blue light is bounced across the sky and reaches your eyes from every direction.\n\nViolet scatters even more than blue, but our eyes are less sensitive to it and some is absorbed high in the atmosphere. That is why the sky appears blue. The same principle explains sunsets: sunlight travels through more air, scattering most blue away and leaving warmer reds and oranges.";
