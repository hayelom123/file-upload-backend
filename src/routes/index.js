import express from "express";

//import routes
// import fileUploadRoutes from "./file_upload_route.js";

const router = express.Router();

const routes = [
  {
    path: "/health",
    route: (req, res) => {
      res.send("File upload backend server is running...");
    },
  },

  //   {
  //     path: "/file-upload",
  //     route: fileUploadRoutes,
  //   },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
