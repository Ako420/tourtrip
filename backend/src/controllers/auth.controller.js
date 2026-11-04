import * as authService from "../services/auth.service.js";

export const signup = async (req, res) => {
  const token = await authService.signup(req.validated.body);
  res.status(201).json({ token });
};

export const login = async (req, res) => {
  const token = await authService.login(req.validated.body);
  res.json({ token });
};

export const getMe = async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  res.json(user);
};
