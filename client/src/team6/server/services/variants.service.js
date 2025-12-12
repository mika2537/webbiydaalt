import axios from "axios";

const LMS_API = "https://todu.mn/bs/lms/v1";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.LMS_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export async function getVariants(examId) {
  try {
    const response = await axios.get(`${LMS_API}/exams/${examId}/variants`, {
      headers: getHeaders(),
    });
    console.log("✅ GET VARIANTS:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error getting variants:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function createVariant(examId, data) {
  try {
    const response = await axios.post(
      `${LMS_API}/exams/${examId}/variants`,
      {
        name: data.name || "Variant A",
        description: data.description || "",
      },
      { headers: getHeaders() }
    );

    console.log("✅ VARIANT CREATED:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating variant:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function getVariant(variantId) {
  try {
    const response = await axios.get(`${LMS_API}/variants/${variantId}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error getting variant:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function updateVariant(variantId, data) {
  try {
    const response = await axios.put(`${LMS_API}/variants/${variantId}`, data, {
      headers: getHeaders(),
    });
    console.log("✅ VARIANT UPDATED:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating variant:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function deleteVariant(variantId) {
  try {
    const response = await axios.delete(`${LMS_API}/variants/${variantId}`, {
      headers: getHeaders(),
    });
    console.log("✅ VARIANT DELETED");
    return { success: true };
  } catch (error) {
    console.error(
      "❌ Error deleting variant:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function getVariantQuestions(variantId) {
  try {
    const response = await axios.get(
      `${LMS_API}/variants/${variantId}/questions`,
      { headers: getHeaders() }
    );
    console.log("✅ GET VARIANT QUESTIONS:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error getting variant questions:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function addQuestionToVariant(variantId, questionId, data = {}) {
  try {
    const response = await axios.post(
      `${LMS_API}/variants/${variantId}/questions`,
      {
        question_id: questionId,
        point: data.point || 1,
        priority: data.priority || 1,
      },
      { headers: getHeaders() }
    );
    console.log("✅ QUESTION ADDED TO VARIANT:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error adding question to variant:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function removeQuestionFromVariant(variantId, questionId) {
  try {
    const response = await axios.delete(
      `${LMS_API}/variants/${variantId}/questions/${questionId}`,
      { headers: getHeaders() }
    );
    console.log("✅ QUESTION REMOVED FROM VARIANT");
    return { success: true };
  } catch (error) {
    console.error(
      "❌ Error removing question from variant:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function getExamQuestions(examId) {
  try {
    const response = await axios.get(`${LMS_API}/exams/${examId}/questions`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error getting exam questions:",
      error.response?.data || error.message
    );
    throw error;
  }
}
