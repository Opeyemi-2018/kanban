// import { Comment } from "../models/commentModel.js";

// export const CreateComment = async (req, res) => {
//   try {
//     const { text, taskId } = req.body;

//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const newComment = new Comment({
//       text,
//       taskId,
//       user: {
//         id: req.user.id,
//         name: req.user.name,
//         image: req.user.image,
//       },
//     });

//     await newComment.save();
//     res.status(201).json(newComment);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const fetchComment = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const comments = await Comment.find({ taskId }).sort({ createdAt: -1 });
//     res.json(comments);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
