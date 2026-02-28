import { Phone, Mail, Calendar } from 'lucide-react';
import { Patient } from '../../store/crmStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getInitials } from '../../utils/helpers';

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
    >
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-green-600 font-semibold">
          {getInitials(patient.fullName)}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{patient.fullName}</h3>
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{patient.phone}</span>
          </div>
          {patient.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{patient.email}</span>
            </div>
          )}
        </div>
      </div>

      {patient.nextAppointment && (
        <div className="text-sm text-gray-600 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {format(new Date(patient.nextAppointment), 'd MMM', { locale: ru })}
        </div>
      )}
    </div>
  );
}
