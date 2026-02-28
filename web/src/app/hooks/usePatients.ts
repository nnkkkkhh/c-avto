import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCrmStore, Patient } from '../store/crmStore';

export function usePatients() {
  const { patients, addPatient, updatePatient, deletePatient } = useCrmStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 200));
      return patients;
    },
    initialData: patients,
    staleTime: 1000 * 60
  });

  const addMutation = useMutation({
    mutationFn: async (patient: Omit<Patient, 'id'>) => {
      await new Promise(r => setTimeout(r, 300));
      addPatient(patient);
      return patient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Patient> }) => {
      await new Promise(r => setTimeout(r, 300));
      updatePatient(id, data);
      return { id, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise(r => setTimeout(r, 300));
      deletePatient(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });

  return {
    patients: data || patients,
    isLoading,
    addPatient: addMutation.mutate,
    updatePatient: (id: string, data: Partial<Patient>) => updateMutation.mutate({ id, data }),
    deletePatient: deleteMutation.mutate
  };
}
