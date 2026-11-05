export const getPageInfo = (total, requestedPage, pageSize) => {
  const pageCount = Math.max(Math.ceil(total / pageSize), 1);
  const page = Math.min(requestedPage, pageCount);

  return { page, pageCount, skip: (page - 1) * pageSize, take: pageSize };
};
