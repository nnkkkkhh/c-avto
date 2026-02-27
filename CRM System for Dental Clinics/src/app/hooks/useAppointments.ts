import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCrmStore, Appointment } from '../store/crmStore';

export function useAppointments() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useCrmStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 200));
      return appointments;
    },
    initialData: appointments,
    staleTime: 1000 * 60
  });

  const addMutation = useMutation({
    mutationFn: async (appointment: Omit<Appointment, 'id'>) => {
      await new Promise(r => setTimeout(r, 300));
      addAppointment(appointment);
      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Appointment> }) => {
      await new Promise(r => setTimeout(r, 300));
      updateAppointment(id, data);
      return { id, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise(r => setTimeout(r, 300));
      deleteAppointment(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });

  return {
    appointments: data || appointments,
    isLoading,
    addAppointment: addMutation.mutate,
    updateAppointment: (id: string, data: Partial<Appointment>) => updateMutation.mutate({ id, data }),
    deleteAppointment: deleteMutation.mutate
  };
}
