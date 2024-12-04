// import * as FLORASYNTH from "florasynth";
// import * as THREE from "three";

// const { GLTFExporter } = require("node-three-gltf");

// export default async function handler(req, res) {
//   try {
//     res.setHeader("Access-Control-Allow-Origin", "https://ao.bot");

//     // changed name to uid for the sake of consistency
//     const { experience } = req.query;

//     const scene = new THREE.Scene();

//     async function generateTree() {
//       const ashTree = new FLORASYNTH.Tree(FLORASYNTH.Presets.ASH);
//       return await ashTree.generate();
//     }

//     const ashTreeMeshes = await generateTree();

//     if (ashTreeMeshes.mesh) scene.add(ashTreeMeshes.mesh);
//     if (ashTreeMeshes.foliageMesh) scene.add(ashTreeMeshes.foliageMesh);
//     if (ashTreeMeshes.fruitMesh) scene.add(ashTreeMeshes.fruitMesh);

//     const exporter = new GLTFExporter();
//     exporter.parse(
//       scene,
//       (gltf) => {
//         // send the .glb file as a response to the client
//         res.setHeader("Content-Type", "application/octet-stream");
//         res.setHeader("Content-Disposition", "attachment; filename=tree.glb");
//         res.send(gltf);
//       },
//       { binary: false } // Set to true to export as .glb
//     );
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       data: err,
//       status: 500,
//     });
//   }
// }
