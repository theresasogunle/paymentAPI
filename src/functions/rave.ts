export default () => {
  let BaseURL = process.env.RAVE_BASEURL;
  if (process.env.RAVE_ENV.toLowerCase() === "live") {
    BaseURL = process.env.RAVE_LIVEURL;
  }
  return BaseURL;
};
