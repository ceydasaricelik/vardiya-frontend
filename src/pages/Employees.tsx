import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, User } from 'lucide-react';
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
import { employeeAPI, Employee, EmployeeInput } from '@/lib/api';
import { useStore } from '@/store/useStore';
import LoadingSpinner from '@/components/LoadingSpinner';

const Employees = () => {
  const { employees, setEmployees, addEmployee, updateEmployee, removeEmployee } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeInput>();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching employees...');
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
      console.log('Employees fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Çalışanlar yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: EmployeeInput) => {
    try {
      console.log('Submitting employee data:', data);
      if (editingEmployee) {
        const response = await employeeAPI.update(editingEmployee.id, data);
        updateEmployee(editingEmployee.id, response.data);
        console.log('Employee updated:', response.data);
        toast.success('Çalışan başarıyla güncellendi');
      } else {
        const response = await employeeAPI.create(data);
        addEmployee(response.data);
        console.log('Employee created:', response.data);
        toast.success('Çalışan başarıyla eklendi');
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Çalışan kaydedilirken bir hata oluştu');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu çalışanı silmek istediğinizden emin misiniz?')) return;

    try {
      console.log('Deleting employee:', id);
      await employeeAPI.delete(id);
      removeEmployee(id);
      console.log('Employee deleted successfully');
      toast.success('Çalışan başarıyla silindi');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Çalışan silinirken bir hata oluştu');
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    reset({ name: employee.name, position: employee.position });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEmployee(null);
    reset({ name: '', position: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Çalışanlar
              </CardTitle>
              <CardDescription>Çalışan bilgilerini yönetin</CardDescription>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              data-cy="add-employee-btn"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Yeni Çalışan Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : employees.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground" data-cy="no-employees">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Henüz çalışan eklenmemiş</p>
              <p className="text-sm mt-1">Başlamak için "Yeni Çalışan Ekle" butonuna tıklayın</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ad Soyad</TableHead>
                    <TableHead>Pozisyon</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id} data-cy={`employee-row-${employee.id}`}>
                      <TableCell className="font-medium">{employee.id}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(employee)}
                          data-cy={`edit-employee-${employee.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(employee.id)}
                          data-cy={`delete-employee-${employee.id}`}
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
        <DialogContent data-cy="employee-dialog">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? 'Çalışanı Düzenle' : 'Yeni Çalışan Ekle'}
            </DialogTitle>
            <DialogDescription>
              Çalışan bilgilerini girin ve kaydedin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} data-cy="employee-form">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  placeholder="Ahmet Yılmaz"
                  {...register('name', { required: 'Ad soyad zorunludur' })}
                  data-cy="employee-name-input"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Pozisyon</Label>
                <Input
                  id="position"
                  placeholder="Müdür"
                  {...register('position', { required: 'Pozisyon zorunludur' })}
                  data-cy="employee-position-input"
                />
                {errors.position && (
                  <p className="text-sm text-destructive">{errors.position.message}</p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                data-cy="employee-cancel-btn"
              >
                İptal
              </Button>
              <Button type="submit" data-cy="employee-submit-btn">
                {editingEmployee ? 'Güncelle' : 'Ekle'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
