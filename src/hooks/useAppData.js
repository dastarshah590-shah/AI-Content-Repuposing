import { useCallback, useEffect, useState } from "react";
import {
  connectIntegration,
  createBrandProfile,
  createClient,
  createTeamMember,
  getBrandProfiles,
  getIntegrations,
  getPlans,
  getSession,
  getWorkspace,
  login,
  queueOutput,
  register,
  updateBrandProfile,
  updatePlan,
  updateProfile
} from "../services/api.js";

export function useAppData() {
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState(null);
  const [plans, setPlans] = useState([]);
  const [brandProfiles, setBrandProfiles] = useState([]);
  const [clients, setClients] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [publishQueue, setPublishQueue] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const refreshAccount = useCallback(async () => {
    const data = await getSession();
    setUser(data.user);
    setUsage(data.usage);
    return data;
  }, []);

  const refreshPlans = useCallback(async () => {
    const data = await getPlans();
    setPlans(data.plans || []);
    return data.plans || [];
  }, []);

  const refreshBrands = useCallback(async () => {
    const data = await getBrandProfiles();
    setBrandProfiles(data.brandProfiles || []);
    return data.brandProfiles || [];
  }, []);

  const refreshWorkspace = useCallback(async () => {
    const data = await getWorkspace();
    setClients(data.clients || []);
    setTeamMembers(data.teamMembers || []);
    return data;
  }, []);

  const refreshIntegrations = useCallback(async () => {
    const data = await getIntegrations();
    setIntegrations(data.integrations || []);
    setPublishQueue(data.publishQueue || []);
    return data;
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoadingData(true);
    try {
      await Promise.all([
        refreshAccount(),
        refreshPlans(),
        refreshBrands(),
        refreshWorkspace(),
        refreshIntegrations()
      ]);
    } finally {
      setIsLoadingData(false);
    }
  }, [refreshAccount, refreshBrands, refreshIntegrations, refreshPlans, refreshWorkspace]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  async function runLogin(payload) {
    const data = await login(payload);
    setUser(data.user);
    setUsage(data.usage);
    await refreshAll();
    return data;
  }

  async function runRegister(payload) {
    const data = await register(payload);
    setUser(data.user);
    setUsage(data.usage);
    await refreshAll();
    return data;
  }

  async function runUpdateProfile(payload) {
    const data = await updateProfile(payload);
    setUser(data.user);
    setUsage(data.usage);
    return data;
  }

  async function runUpdatePlan(plan) {
    const data = await updatePlan(plan);
    setUser(data.user);
    setUsage(data.usage);
    await Promise.all([refreshBrands(), refreshWorkspace()]);
    return data;
  }

  async function runSaveBrandProfile(profileId, payload) {
    const data = profileId
      ? await updateBrandProfile(profileId, payload)
      : await createBrandProfile(payload);
    await refreshBrands();
    return data.brandProfile;
  }

  async function runCreateClient(payload) {
    const data = await createClient(payload);
    await refreshWorkspace();
    return data.client;
  }

  async function runCreateTeamMember(payload) {
    const data = await createTeamMember(payload);
    await refreshWorkspace();
    return data.teamMember;
  }

  async function runConnectIntegration(integrationId) {
    const data = await connectIntegration(integrationId);
    await refreshIntegrations();
    return data.integration;
  }

  async function runQueueOutput(payload) {
    const data = await queueOutput(payload);
    await refreshIntegrations();
    return data.queueItem;
  }

  function updateUsage(nextUsage) {
    if (nextUsage) setUsage(nextUsage);
  }

  return {
    user,
    usage,
    plans,
    brandProfiles,
    clients,
    teamMembers,
    integrations,
    publishQueue,
    isLoadingData,
    refreshAll,
    refreshAccount,
    refreshBrands,
    refreshWorkspace,
    refreshIntegrations,
    runLogin,
    runRegister,
    runUpdateProfile,
    runUpdatePlan,
    runSaveBrandProfile,
    runCreateClient,
    runCreateTeamMember,
    runConnectIntegration,
    runQueueOutput,
    updateUsage
  };
}