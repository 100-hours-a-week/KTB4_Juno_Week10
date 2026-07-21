export const isOwner = (ownerId, currentUserId) => {
  return ownerId !== undefined && String(ownerId) === String(currentUserId);
};
