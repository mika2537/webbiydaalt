let Variants = [];

export async function getVariants(examId) {
  return Variants.filter((x) => x.examId === examId);
}

export async function createVariant(examId, data) {
  const variant = {
    id: Date.now().toString(),
    examId,
    ...data,
  };
  Variants.push(variant);
  return variant;
}

export async function getVariant(examId, id) {
  return Variants.find((x) => x.examId === examId && x.id === id);
}

export async function updateVariant(examId, id, data) {
  const index = Variants.findIndex((x) => x.examId === examId && x.id === id);
  Variants[index] = { ...Variants[index], ...data };
  return Variants[index];
}
