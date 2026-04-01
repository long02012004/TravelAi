import type { AxiosResponse } from "axios";
import type { BackendResponse } from "../types";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface Trip {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  budget: number;
  description?: string;
  itinerary?: unknown[];
  checklist?: ChecklistItem[];
  expenses?: Expense[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
}

export interface Expense {
  id?: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface CreateTripRequest {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  budget: number;
  description?: string;
}

// === TRIP CRUD Operations ===

// 1. Tạo chuyến đi mới
export const createTrip = (
  tripData: CreateTripRequest,
): Promise<AxiosResponse<BackendResponse<Trip>>> => {
  return instance.post<BackendResponse<Trip>>("/trips", tripData);
};

// 2. Lấy danh sách chuyến đi của user hiện tại
export const getMyTrips = (
  status?: "upcoming" | "ongoing" | "completed",
): Promise<AxiosResponse<BackendResponse<Trip[]>>> => {
  const url = status ? `/trips?status=${status}` : "/trips";
  return instance.get<BackendResponse<Trip[]>>(url);
};

// 3. Lấy chi tiết một chuyến đi
export const getTripDetail = (
  tripId: number,
): Promise<AxiosResponse<BackendResponse<Trip>>> => {
  return instance.get<BackendResponse<Trip>>(`/trips/${tripId}`);
};

// 4. Cập nhật thông tin chuyến đi
export const updateTrip = (
  tripId: number,
  tripData: Partial<CreateTripRequest>,
): Promise<AxiosResponse<BackendResponse<Trip>>> => {
  return instance.patch<BackendResponse<Trip>>(`/trips/${tripId}`, tripData);
};

// 5. Xóa chuyến đi
export const deleteTrip = (
  tripId: number,
): Promise<AxiosResponse<BackendResponse<null>>> => {
  return instance.delete<BackendResponse<null>>(`/trips/${tripId}`);
};

// === CHECKLIST Operations ===

// 6. Thêm item vào checklist
export const addChecklistItem = (
  tripId: number,
  label: string,
): Promise<AxiosResponse<BackendResponse<ChecklistItem>>> => {
  return instance.post<BackendResponse<ChecklistItem>>(
    `/trips/${tripId}/checklist-item`,
    { label },
  );
};

// 7. Cập nhật checklist item
export const updateChecklistItem = (
  tripId: number,
  itemId: string,
  updates: Partial<ChecklistItem>,
): Promise<AxiosResponse<BackendResponse<ChecklistItem>>> => {
  return instance.patch<BackendResponse<ChecklistItem>>(
    `/trips/${tripId}/checklist-item/${itemId}`,
    updates,
  );
};

// 8. Xóa checklist item
export const deleteChecklistItem = (
  tripId: number,
  itemId: string,
): Promise<AxiosResponse<BackendResponse<null>>> => {
  return instance.delete<BackendResponse<null>>(
    `/trips/${tripId}/checklist-item/${itemId}`,
  );
};

// 9. Cập nhật toàn bộ checklist
export const updateTripChecklist = (
  tripId: number,
  checklist: ChecklistItem[],
): Promise<AxiosResponse<BackendResponse<Trip>>> => {
  return instance.put<BackendResponse<Trip>>(`/trips/${tripId}/checklist`, {
    checklist,
  });
};

// === EXPENSES Operations ===

// 10. Lấy danh sách chi tiêu chuyến đi
export const getTripExpenses = (
  tripId: number,
): Promise<AxiosResponse<BackendResponse<Expense[]>>> => {
  return instance.get<BackendResponse<Expense[]>>(`/trips/${tripId}/expenses`);
};

// 11. Thêm chi tiêu mới
export const addExpense = (
  tripId: number,
  expense: Expense,
): Promise<AxiosResponse<BackendResponse<Expense>>> => {
  return instance.post<BackendResponse<Expense>>(
    `/trips/${tripId}/expenses`,
    expense,
  );
};

// 12. Cập nhật chi tiêu
export const updateExpense = (
  tripId: number,
  expenseId: string,
  updates: Partial<Expense>,
): Promise<AxiosResponse<BackendResponse<Expense>>> => {
  return instance.patch<BackendResponse<Expense>>(
    `/trips/${tripId}/expenses/${expenseId}`,
    updates,
  );
};

// 13. Xóa chi tiêu
export const deleteExpense = (
  tripId: number,
  expenseId: string,
): Promise<AxiosResponse<BackendResponse<null>>> => {
  return instance.delete<BackendResponse<null>>(
    `/trips/${tripId}/expenses/${expenseId}`,
  );
};

// === TRIP FROM AI ===

// 14. Lưu chuyến đi được tạo từ AI
export const saveTripFromAI = (
  aiResponse: unknown,
): Promise<AxiosResponse<BackendResponse<Trip>>> => {
  return instance.post<BackendResponse<Trip>>("/trips/save", aiResponse);
};
