import Swal from 'sweetalert2';

const WarningAlert = Swal.mixin({
  showDenyButton: true,
  confirmButtonText: '<label className="text-line text-2xl">Yes</label>',
  denyButtonText: 'No',
  background: '#191A21',
  color: '#ffb86c',
  confirmButtonColor: '#ffb86c',
  denyButtonColor: '#44475a',
  icon: 'warning',
  iconColor: '#ffb86c',
  buttonsStyling: true,
});

const DangerAlert = Swal.mixin({
  showDenyButton: true,
  confirmButtonText: 'Yes',
  denyButtonText: 'No',
  background: '#191A21',
  color: '#ff5555',
  confirmButtonColor: '#ff5555',
  denyButtonColor: '#44475a',
  icon: 'warning',
  iconColor: '#ff5555',
  buttonsStyling: true,
});

const SuccessToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  background: '#191A21',
  color: '#50fa7b',
  icon: 'success',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const WarningToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  background: '#191A21',
  color: '#d16d15',
  icon: 'warning',
  iconColor: '#d16d15',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const DangerToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  background: '#191A21',
  color: '#ff5555',
  icon: 'error',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export { WarningAlert, DangerAlert, SuccessToast, WarningToast, DangerToast };
