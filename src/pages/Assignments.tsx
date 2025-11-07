import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, ClipboardList } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { assignmentAPI, employeeAPI, shiftAPI, AssignmentInput } from '@/lib/api';
import { useStore } from '@/store/useStore';
import LoadingSpinner from '@/components/LoadingSpinner';

const Assignments = () => {
  const {
    assignments,
    setAssignments,
    addAssignment,
    removeAssignment,
    employees,
    setEmployees,
    shifts,
    setShifts,
  } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedShiftId, setSelectedShiftId] = useState<string>('');

  const { handleSubmit } = useForm<AssignmentInput>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching assignments, employees, and shifts...');
      const [assignmentsRes, employeesRes, shiftsRes] = await Promise.all([
        assignmentAPI.getAll(),
        employeeAPI.getAll(),
        shiftAPI.getAll(),
      ]);
      setAssignments(assignmentsRes.data);
      setEmployees(employeesRes.data);
      setShifts(shiftsRes.data);
      console.log('Data fetched successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Veriler yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!selectedEmployeeId || !selectedShiftId) {
      toast.error('Lütfen çalışan ve vardiya seçin');
      return;
    }

    const data: AssignmentInput = {
      employee_id: parseInt(selectedEmployeeId),
      shift_id: parseInt(selectedShiftId),
    };

    try {
      console.log('Submitting assignment data:', data);
      const response = await assignmentAPI.create(data);
      addAssignment(response.data);
      console.log('Assignment created:', response.data);
      toast.success('Atama başarıyla oluşturuldu');
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Atama oluşturulurken bir hata oluştu');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu atamayı silmek istediğinizden emin misiniz?')) return;

    try {
      console.log('Deleting assignment:', id);
      await assignmentAPI.delete(id);
      removeAssignment(id);
      console.log('Assignment deleted successfully');
      toast.success('Atama başarıyla silindi');
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Atama silinirken bir hata oluştu');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEmployeeId('');
    setSelectedShiftId('');
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee ? employee.name : 'Bilinmiyor';
  };

  const getShiftName = (shiftId: number) => {
    const shift = shifts.find((s) => s.id === shiftId);
    return shift ? shift.name : 'Bilinmiyor';
  };

  const getShiftTime = (shiftId: number) => {
    const shift = shifts.find((s) => s.id === shiftId);
    return shift ? `${shift.start_time} - ${shift.end_time}` : '';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-success-foreground" />
                Atamalar
              </CardTitle>
              <CardDescription>Çalışan vardiya atamalarını yönetin</CardDescription>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              data-cy="add-assignment-btn"
              className="gap-2"
              disabled={employees.length === 0 || shifts.length === 0}
            >
              <Plus className="h-4 w-4" />
              Yeni Atama Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {employees.length === 0 || shifts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Atama yapabilmek için önce çalışan ve vardiya eklemelisiniz</p>
            </div>
          ) : isLoading ? (
            <LoadingSpinner />
          ) : assignments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground" data-cy="no-assignments">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Henüz atama yapılmamış</p>
              <p className="text-sm mt-1">Başlamak için "Yeni Atama Ekle" butonuna tıklayın</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Çalışan</TableHead>
                    <TableHead>Vardiya</TableHead>
                    <TableHead>Zaman Aralığı</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id} data-cy={`assignment-row-${assignment.id}`}>
                      <TableCell className="font-medium">{assignment.id}</TableCell>
                      <TableCell>{getEmployeeName(assignment.employee_id)}</TableCell>
                      <TableCell>{getShiftName(assignment.shift_id)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {getShiftTime(assignment.shift_id)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(assignment.id)}
                          data-cy={`delete-assignment-${assignment.id}`}
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
        <DialogContent data-cy="assignment-dialog">
          <DialogHeader>
            <DialogTitle>Yeni Atama Ekle</DialogTitle>
            <DialogDescription>
              Çalışan ve vardiya seçerek atama yapın.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} data-cy="assignment-form">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Çalışan</Label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={setSelectedEmployeeId}
                >
                  <SelectTrigger data-cy="assignment-employee-select">
                    <SelectValue placeholder="Çalışan seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem
                        key={employee.id}
                        value={employee.id.toString()}
                        data-cy={`employee-option-${employee.id}`}
                      >
                        {employee.name} - {employee.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift">Vardiya</Label>
                <Select
                  value={selectedShiftId}
                  onValueChange={setSelectedShiftId}
                >
                  <SelectTrigger data-cy="assignment-shift-select">
                    <SelectValue placeholder="Vardiya seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts.map((shift) => (
                      <SelectItem
                        key={shift.id}
                        value={shift.id.toString()}
                        data-cy={`shift-option-${shift.id}`}
                      >
                        {shift.name} ({shift.start_time} - {shift.end_time})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                data-cy="assignment-cancel-btn"
              >
                İptal
              </Button>
              <Button type="submit" data-cy="assignment-submit-btn">
                Atama Yap
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assignments;
