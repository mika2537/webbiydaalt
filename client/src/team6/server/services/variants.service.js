let Variants = [];

// GET ALL VARIANTS OF EXAM
export async function getVariants(examId) {
  return Variants.filter((x) => String(x.examId) === String(examId));
}

// CREATE VARIANT
export async function createVariant(examId, data) {
  const variant = {
    id: Date.now().toString(),
    examId: String(examId),
    name: data.name || "Variant",
    description: data.description || "",
    questions: data.questions || [], // allow questions inside variant
    createdAt: new Date().toISOString(),
  };

  Variants.push(variant);
  return variant;
}

// GET ONE VARIANT
export async function getVariant(examId, id) {
  return Variants.find(
    (x) => String(x.examId) === String(examId) && String(x.id) === String(id)
  );
}

// UPDATE VARIANT
export async function updateVariant(examId, id, data) {
  const index = Variants.findIndex(
    (x) => String(x.examId) === String(examId) && String(x.id) === String(id)
  );

  if (index === -1) return null; // prevent crash

  Variants[index] = {
    ...Variants[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return Variants[index];
}
