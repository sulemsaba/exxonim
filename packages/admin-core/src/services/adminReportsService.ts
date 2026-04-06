import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiAdminActivityReport,
  ApiContentActivityReport,
  ApiOperationsReport,
  ApiReportParams,
} from "../types/api";

export async function getAdminOperationsReport(params: ApiReportParams = {}) {
  const response = await api.get<ApiOperationsReport>(apiRoutes.admin.reports.operations, {
    params,
  });
  return response.data;
}

export async function getAdminActivityReport(params: Pick<ApiReportParams, "from" | "to" | "grain"> = {}) {
  const response = await api.get<ApiAdminActivityReport>(
    apiRoutes.admin.reports.adminActivity,
    {
      params,
    }
  );
  return response.data;
}

export async function getAdminContentActivityReport(
  params: Pick<ApiReportParams, "from" | "to" | "grain"> = {}
) {
  const response = await api.get<ApiContentActivityReport>(
    apiRoutes.admin.reports.contentActivity,
    {
      params,
    }
  );
  return response.data;
}
