export const createPagination = ({
  page = 1,
  limit = 10,
  orderBy = "createdAt",
  order = "desc",
} = {}) => {
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    orderBy: { [orderBy]: order },
  };
};

export const formatPagination = (data, page, limit) => {
  const [items, totalCount] = Array.isArray(data)
    ? [data, data.length]
    : [data.items, data.totalCount];

  return {
    items,
    pagination: {
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page * limit < totalCount,
      hasPrev: page > 1,
    },
  };
};
