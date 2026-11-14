// Lets the code import fonts, sounds and images as files.
declare module '*.woff2' {
  const url: string;
  export default url;
}
declare module '*.png' {
  const url: string;
  export default url;
}
declare module '*.mp3' {
  const url: string;
  export default url;
}
declare module '*.wav' {
  const url: string;
  export default url;
}
