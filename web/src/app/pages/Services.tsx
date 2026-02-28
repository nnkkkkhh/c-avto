import { useState } from 'react';
import { useCrmStore, DentalService } from '../store/crmStore';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Clock, DollarSign, Tag, X, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['Все', 'Диагностика', 'Терапия', 'Гигиена', 'Эстетика', 'Хирургия', 'Ортодонтия', 'Ортопедия'];

const CATEGORY_COLORS: Record<string, string> = {
  Диагностика: 'bg-blue-50 text-blue-700',
  Терапия: 'bg-green-50 text-green-700',
  Гигиена: 'bg-teal-50 text-teal-700',
  Эстетика: 'bg-purple-50 text-purple-700',
  Хирургия: 'bg-red-50 text-red-700',
  Ортодонтия: 'bg-orange-50 text-orange-700',
  Ортопедия: 'bg-indigo-50 text-indigo-700'
};

function ServiceModal({
  service,
  onClose,
  onSave
}: {
  service: DentalService | null;
  onClose: () => void;
  onSave: (data: Omit<DentalService, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    category: service?.category || 'Терапия',
    duration: service?.duration || 60,
    price: service?.price || 0,
    description: service?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-gray-900" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {service ? 'Редактировать услугу' : 'Новая услуга'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Название *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              placeholder="Название услуги"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Категория *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
            >
              {CATEGORIES.filter(c => c !== 'Все').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Продолжительность (мин) *
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                min="5"
                step="5"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                Цена (₽) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                min="0"
                step="100"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm resize-none"
              placeholder="Краткое описание услуги..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              style={{ fontWeight: 500 }}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-200"
              style={{ fontWeight: 500 }}
            >
              {service ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Services() {
  const { services, addService, updateService, deleteService } = useCrmStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [modalService, setModalService] = useState<DentalService | null | 'new'>(null);

  const { isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 300));
      return services;
    },
    initialData: services
  });

  const filtered = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = (data: Omit<DentalService, 'id'>) => {
    if (modalService === 'new') {
      addService(data);
      toast.success('Услуга добавлена');
    } else if (modalService) {
      updateService(modalService.id, data);
      toast.success('Услуга обновлена');
    }
    setModalService(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Удалить услугу "${name}"?`)) {
      deleteService(id);
      toast.success('Услуга удалена');
    }
  };

  const totalRevenuePotential = filtered.reduce((sum, s) => sum + s.price, 0);

  if (isLoading && services.length === 0) {
    return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900" style={{ fontSize: '1.75rem', fontWeight: 700 }}>Услуги клиники</h1>
          <p className="text-gray-500 text-sm mt-0.5">Управление прайс-листом</p>
        </div>
        <button
          onClick={() => setModalService('new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-200"
          style={{ fontWeight: 500 }}
        >
          <Plus className="w-4 h-4" />
          Добавить услугу
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Всего услуг</p>
          <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem', fontWeight: 700 }}>{services.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Категорий</p>
          <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            {new Set(services.map(s => s.category)).size}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Мин. цена</p>
          <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            {Math.min(...services.map(s => s.price)).toLocaleString('ru')} ₽
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Макс. цена</p>
          <p className="text-gray-900 mt-1" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            {Math.max(...services.map(s => s.price)).toLocaleString('ru')} ₽
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или описанию..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{ fontWeight: 500 }}
            >
              {cat}
              {cat !== 'Все' && (
                <span className={`ml-1.5 ${selectedCategory === cat ? 'text-blue-100' : 'text-gray-400'}`}>
                  {services.filter(s => s.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{service.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-0.5 inline-block ${CATEGORY_COLORS[service.category] || 'bg-gray-50 text-gray-600'}`} style={{ fontWeight: 500 }}>
                    {service.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setModalService(service)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id, service.name)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {service.description && (
              <p className="text-gray-400 text-xs mb-4 leading-relaxed">{service.description}</p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">{service.duration} мин</span>
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-gray-900" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {service.price.toLocaleString('ru')} ₽
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16">
          <Stethoscope className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">
            {searchQuery ? `Ничего не найдено` : 'Нет услуг в этой категории'}
          </p>
        </div>
      )}

      {/* Modal */}
      {modalService !== null && (
        <ServiceModal
          service={modalService === 'new' ? null : modalService}
          onClose={() => setModalService(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
