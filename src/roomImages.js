const roomImages = import.meta.glob("/src/assets/roomImages/*.jpg", { eager: true });

console.log("Loaded Room Images:", roomImages); // ✅ Debugging

export default Object.fromEntries(
  Object.entries(roomImages).map(([path, module]) => {
    const fileName = path.split("/").pop().replace(".jpg", "").replace(".", "_");
    console.log(`Mapping ${fileName} -> ${module.default}`); // ✅ Debugging
    return [fileName, module.default];
  })
);
