import type { AccordionProps } from '../accordion';
import type { AffixProps } from '../affix';
import type { AlertProps } from '../alert';
import type { AnchorProps } from '../anchor';
import type { AvatarProps } from '../avatar';
import type { BadgeProps, BadgeTextProps } from '../badge';
import type { BreadcrumbProps } from '../breadcrumb';
import type { ButtonProps } from '../button';
import type { CardActionProps, CardActionsProps, CardContentProps, CardHeaderProps, CardProps } from '../card';
import type { CascaderProps } from '../cascader';
import type { CheckboxGroupProps, CheckboxProps } from '../checkbox';
import type { ComposeItemProps, ComposeProps } from '../compose';
import type { DatePickerProps } from '../date-picker';
import type { DrawerFooterProps, DrawerHeaderProps, DrawerProps } from '../drawer';
import type { DropdownProps } from '../dropdown';
import type { EmptyProps } from '../empty';
import type { FabBacktopProps, FabButtonProps, FabProps } from '../fab';
import type { FormItemProps, FormProps } from '../form';
import type { IconProps } from '../icon';
import type { ImageActionProps, ImagePreviewProps, ImageProps } from '../image';
import type { InputNumberProps, InputProps } from '../input';
import type { MenuProps } from '../menu';
import type { ModalProps, ModalHeaderProps, ModalFooterProps, ModalAlertProps } from '../modal';
import type { NotificationProps } from '../notification';
import type { PaginationProps } from '../pagination';
import type { PopoverFooterProps, PopoverHeaderProps, PopoverProps } from '../popover';
import type { ProgressProps } from '../progress';
import type { RadioGroupProps, RadioProps } from '../radio';
import type { RatingProps } from '../rating';
import type { SelectProps } from '../select';
import type { SeparatorProps } from '../separator';
import type { SkeletonProps } from '../skeleton';
import type { SliderProps } from '../slider';
import type { SlidesProps } from '../slides';
import type { SpinnerProps } from '../spinner';
import type { StepperProps } from '../stepper';
import type { SwitchProps } from '../switch';
import type {
  TableEmptyProps,
  TableExpandProps,
  TableFilterProps,
  TableProps,
  TableTdProps,
  TableThActionProps,
  TableThProps,
} from '../table';
import type { TabsProps } from '../tabs';
import type { TagProps } from '../tag';
import type { TextareaProps } from '../textarea';
import type { TimePickerProps } from '../time-picker';
import type { TimelineProps } from '../timeline';
import type { ToastProps } from '../toast';
import type { TooltipProps } from '../tooltip';
import type { TransferProps } from '../transfer';
import type { TreeProps } from '../tree';
import type { TreeSelectProps } from '../tree-select';
import type {
  UploadActionProps,
  UploadButtonProps,
  UploadListProps,
  UploadPictureListProps,
  UploadPictureProps,
  UploadPreviewActionProps,
  UploadProps,
} from '../upload';
import type { VirtualScrollProps } from '../virtual-scroll';

export interface ComponentProps {
  Accordion: AccordionProps<any, any>;
  Affix: AffixProps;
  Alert: AlertProps;
  Anchor: AnchorProps<any>;
  Avatar: AvatarProps;
  Breadcrumb: BreadcrumbProps<any, any>;
  Badge: BadgeProps;
  BadgeText: BadgeTextProps;
  Button: ButtonProps;
  Card: CardProps;
  CardHeader: CardHeaderProps;
  CardContent: CardContentProps;
  CardActions: CardActionsProps;
  CardAction: CardActionProps;
  Cascader: CascaderProps<any, any>;
  Checkbox: CheckboxProps;
  CheckboxGroup: CheckboxGroupProps<any, any>;
  Compose: ComposeProps;
  ComposeItem: ComposeItemProps;
  DatePicker: DatePickerProps;
  Drawer: DrawerProps;
  DrawerHeader: DrawerHeaderProps;
  DrawerFooter: DrawerFooterProps;
  Dropdown: DropdownProps<any, any>;
  Empty: EmptyProps;
  Fab: FabProps;
  Form: FormProps;
  FormItem: FormItemProps<any>;
  FabButton: FabButtonProps;
  FabBacktop: FabBacktopProps;
  Icon: IconProps;
  Image: ImageProps;
  ImageAction: ImageActionProps;
  ImagePreview: ImagePreviewProps;
  Input: InputProps;
  InputNumber: InputNumberProps;
  Menu: MenuProps<any, any>;
  Modal: ModalProps;
  ModalHeader: ModalHeaderProps;
  ModalFooter: ModalFooterProps;
  ModalAlert: ModalAlertProps;
  Notification: NotificationProps;
  Pagination: PaginationProps;
  Popover: PopoverProps;
  PopoverHeader: PopoverHeaderProps;
  PopoverFooter: PopoverFooterProps;
  Progress: ProgressProps;
  Radio: RadioProps;
  RadioGroup: RadioGroupProps<any, any>;
  Rating: RatingProps;
  Select: SelectProps<any, any>;
  Separator: SeparatorProps;
  Skeleton: SkeletonProps;
  Slider: SliderProps;
  Slides: SlidesProps<any, any>;
  Spinner: SpinnerProps;
  Stepper: StepperProps<any>;
  Switch: SwitchProps;
  Table: TableProps;
  TableTh: TableThProps;
  TableThAction: TableThActionProps;
  TableTd: TableTdProps;
  TableFilter: TableFilterProps;
  TableEmpty: TableEmptyProps;
  TableExpand: TableExpandProps;
  Tabs: TabsProps<any, any>;
  Tag: TagProps;
  Textarea: TextareaProps;
  TimePicker: TimePickerProps;
  Timeline: TimelineProps<any>;
  Toast: ToastProps;
  Tooltip: TooltipProps;
  Transfer: TransferProps<any, any>;
  Tree: TreeProps<any, any>;
  TreeSelect: TreeSelectProps<any, any>;
  Upload: UploadProps;
  UploadButton: UploadButtonProps;
  UploadAction: UploadActionProps;
  UploadPreviewAction: UploadPreviewActionProps;
  UploadList: UploadListProps;
  UploadPicture: UploadPictureProps;
  UploadPictureList: UploadPictureListProps;
  VirtualScroll: VirtualScrollProps<any>;
}
