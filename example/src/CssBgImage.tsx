const CssBgImage = (props: { imageSource: string }) => {
  const { imageSource } = props;
  return (
    <div>
      <div>CSS bg image smaller</div>
      <div
        style={{
          width: 100,
          height: 100,
          backgroundImage: `url("${imageSource}")`,
          backgroundColor: "blue",
          backgroundSize: "cover",
        }}
      />
      <div>CSS bg image repeat</div>
      <div
        style={{
          width: 1000,
          height: 1000,
          backgroundImage: `url("${imageSource}")`,
          backgroundColor: "green",
        }}
      />
    </div>
  );
};

export default CssBgImage;
