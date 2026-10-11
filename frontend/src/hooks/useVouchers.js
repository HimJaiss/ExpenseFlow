import { useCallback, useEffect, useState } from "react";
import { voucherApi } from "../services/api";
export function useVouchers(params = {}) {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    setLoading(true); setError("");
    try { const { data } = await voucherApi.list(params); setVouchers(data.vouchers); }
    catch (e) { setError(e.response?.data?.message || "Unable to load vouchers."); }
    finally { setLoading(false); }
  }, [JSON.stringify(params)]);
  useEffect(() => { reload(); }, [reload]);
  return { vouchers, setVouchers, loading, error, reload };
}
