import { Calendar, Clock, User } from 'lucide-react';
import { Appointment } from '../../store/crmStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
}

export function AppointmentCard({ appointment, onEdit, onDelete, onComplete }: AppointmentCardProps) {
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'no-show':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Запланировано';
      case 'completed':
        return 'Завершено';
      case 'cancelled':
        return 'Отменено';
      case 'no-show':
        return 'Не пришел';
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Calendar className="w-6 h-6 text-blue-600" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
            <p className="text-sm text-gray-600">{appointment.service}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
            {getStatusLabel(appointment.status)}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {format(new Date(appointment.date), 'd MMMM yyyy', { locale: ru })}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {appointment.time}
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {appointment.doctorName}
          </div>
        </div>

        {appointment.notes && (
          <p className="text-sm text-gray-600 bg-white p-3 rounded-lg mt-3">
            {appointment.notes}
          </p>
        )}
      </div>

      <div className="flex md:flex-col gap-2">
        {appointment.status === 'scheduled' && onComplete && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            Завершить
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
          >
            Редактировать
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
          >
            Удалить
          </button>
        )}
      </div>
    </div>
  );
}
