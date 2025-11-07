import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { shiftAPI, Shift, ShiftInput } from '@/lib/api';
import { useStore } from '@/store/useStore';
import LoadingSpinner from '@/components/LoadingSpinner';

const Shifts = () => {
  const { shifts, setShifts, addShift, updateShift, removeShift } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShiftInput>();

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching shifts...');
      const response = await shiftAPI.getAll();
      setShifts(response.data);
      console.log('Shifts fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      toast.error('Vardiyalar yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ShiftInput) => {
    try {
      console.log('Submitting shift data:', data);
      if (editingShift) {
        const response = await shiftAPI.update(editingShift.id, data);
        updateShift(editingShift.id, response.data);
        console.log('Shift updated:', response.data);
        toast.success('Vardiya başarıyla güncellendi');
      } else {
        const response = await shiftAPI.create(data);
        addShift(response.data);
        console.log('Shift created:', response.data);
        toast.success('Vardiya başarıyla eklendi');
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving shift:', error);
      toast.error('Vardiya kaydedilirken bir hata oluştu');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu vardiyayı silmek istediğinizden emin misiniz?')) return;

    try {
      console.log('Deleting shift:', id);
      await shiftAPI.delete(id);
      removeShift(id);
      console.log('Shift deleted successfully');
      toast.success('Vardiya başarıyla silindi');
    } catch (error) {
      console.error('Error deleting shift:', error);
      toast.error('Vardiya silinirken bir hata oluştu');
    }
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    reset({
      name: shift.name,
      start_time: shift.start_time,
      end_time: shift.end_time,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingShift(null);
    reset({ name: '', start_time: '', end_time: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent-foreground" />
                Vardiyalar
              </CardTitle>
              <CardDescription>Vardiya planlarını yönetin</CardDescription>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              data-cy="add-shift-btn"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Yeni Vardiya Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : shifts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground" data-cy="no-shifts">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Henüz vardiya eklenmemiş</p>
              <p className="text-sm mt-1">Başlamak için "Yeni Vardiya Ekle" butonuna tıklayın</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Vardiya Adı</TableHead>
                    <TableHead>Başlangıç Saati</TableHead>
                    <TableHead>Bitiş Saati</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((shift) => (
                    <TableRow key={shift.id} data-cy={`shift-row-${shift.id}`}>
                      <TableCell className="font-medium">{shift.id}</TableCell>
                      <TableCell>{shift.name}</TableCell>
                      <TableCell>{shift.start_time}</TableCell>
                      <TableCell>{shift.end_time}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(shift)}
                          data-cy={`edit-shift-${shift.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(shift.id)}
                          data-cy={`delete-shift-${shift.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent data-cy="shift-dialog">
          <DialogHeader>
            <DialogTitle>
              {editingShift ? 'Vardiyayı Düzenle' : 'Yeni Vardiya Ekle'}
            </DialogTitle>
            <DialogDescription>
              Vardiya bilgilerini girin ve kaydedin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} data-cy="shift-form">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vardiya Adı</Label>
                <Input
                  id="name"
                  placeholder="Sabah Vardiyası"
                  {...register('name', { required: 'Vardiya adı zorunludur' })}
                  data-cy="shift-name-input"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_time">Başlangıç Saati</Label>
                <Input
                  id="start_time"
                  type="time"
                  {...register('start_time', { required: 'Başlangıç saati zorunludur' })}
                  data-cy="shift-start-input"
                />
                {errors.start_time && (
                  <p className="text-sm text-destructive">{errors.start_time.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">Bitiş Saati</Label>
                <Input
                  id="end_time"
                  type="time"
                  {...register('end_time', { required: 'Bitiş saati zorunludur' })}
                  data-cy="shift-end-input"
                />
                {errors.end_time && (
                  <p className="text-sm text-destructive">{errors.end_time.message}</p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                data-cy="shift-cancel-btn"
              >
                İptal
              </Button>
              <Button type="submit" data-cy="shift-submit-btn">
                {editingShift ? 'Güncelle' : 'Ekle'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shifts;
