import * as roomService from "../services/room.service.js";

const isValidPrice = (value) => {
  return (
    (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0
  );
};

export const getRooms = async (req, res) => {
  const rooms = await roomService.getAllRooms();
  res.json(rooms);
};

export const createRoom = async (req, res) => {
  const { number, type, pricePerNight } = req.body ?? {};

  if (
    typeof number !== "string" ||
    !number ||
    typeof type !== "string" ||
    !type ||
    !isValidPrice(pricePerNight)
  ) {
    return res.status(400).json({
      message:
        "number and type must be text, and pricePerNight a non-negative number",
    });
  }

  const room = await roomService.createRoom({ number, type, pricePerNight });
  res.status(201).json(room);
};
