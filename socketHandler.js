const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Connected to WebSockets: ${socket.id}`);

    // --- 1. Real-time One-to-One Chat ---
    socket.on('join_chat', (roomId) => {
      socket.join(roomId);
    });

    socket.on('send_message', (data) => {
      // data: { roomId, senderName, text }
      io.to(data.roomId).emit('receive_message', data);
    });

    // --- 2. WebRTC Video Call Signaling ---
    socket.on('join_video_room', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user_joined', socket.id);
    });

    socket.on('video_offer', (data) => {
      // data: { roomId, offer }
      socket.to(data.roomId).emit('video_offer', data.offer);
    });

    socket.on('video_answer', (data) => {
      // data: { roomId, answer }
      socket.to(data.roomId).emit('video_answer', data.answer);
    });

    socket.on('ice_candidate', (data) => {
      // data: { roomId, candidate }
      socket.to(data.roomId).emit('ice_candidate', data.candidate);
    });

    // --- 3. Emergency SOS Broadcast ---
    socket.on('trigger_emergency', (data) => {
      io.emit('admin_emergency_alert', {
        name: data.name,
        location: data.location,
        time: new Date().toLocaleTimeString()
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;