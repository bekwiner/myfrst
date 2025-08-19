  // Importlar
  import ClientRequest from "../models/ClientRequest.model.js";

  // Yangi so‘rov qo‘shish
  // POST /client-requests
  export const createClientRequest= async (req, res) => {
    try {
      const newRequest = new ClientRequest(req.body);
      const savedRequest = await newRequest.save();
      res.status(201).json(savedRequest);
    } catch (error) {
      res.status(400).json({ message: 'So‘rovni yaratishda xatolik', error });
    }
  };

  // Barcha so‘rovlarni olish
  export const getAllClientRequests = async (_unused, res) => {
    try {
      const requests = await ClientRequest.find();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: 'So‘rovlarni olishda xatolik', error });
    }
  };
  // ID orqali olish
  export const getClientRequestById = async (req, res) => {
    try {
      const request = await ClientRequest.findById(req.params.id);
      if (!request) return res.status(404).json({ message: "So‘rov topilmadi" });
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // So‘rovni yangilash
  export const updateClientRequest = async (req, res) => {
    try {
      const updated = await ClientRequest.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated)
        return res.status(404).json({ message: "Yangilash uchun topilmadi" });
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // So‘rovni o‘chirish
  export const deleteClientRequest = async (req, res) => {
    try {
      const deleted = await ClientRequest.findByIdAndDelete(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: "O‘chirish uchun topilmadi" });
      res.status(200).json({ message: "So‘rov o‘chirildi" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
