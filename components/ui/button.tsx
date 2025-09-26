// "use client";

// import * as React from 'react';
// import { Slot } from '@radix-ui/react-slot';
// import { cva, type VariantProps } from 'class-variance-authority';
// import { cn } from '@/lib/utils';
// import { motion } from 'framer-motion';

// const buttonVariants = cva(
//   'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
//   {
//     variants: {
//       variant: {
//         default: 'bg-primary text-primary-foreground hover:bg-primary/90',
//         destructive:
//           'bg-destructive text-destructive-foreground hover:bg-destructive/90',
//         outline:
//           'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
//         secondary:
//           'bg-secondary text-secondary-foreground hover:bg-secondary/80',
//         ghost: 'hover:bg-accent hover:text-accent-foreground',
//         link: 'text-primary underline-offset-4 hover:underline',
//       },
//       size: {
//         default: 'h-10 px-4 py-2',
//         sm: 'h-9 rounded-md px-3',
//         lg: 'h-11 rounded-md px-8',
//         icon: 'h-10 w-10',
//       },
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default',
//     },
//   }
// );

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean;
//   hoverScale?: number;
//   tapScale?: number;
//   disableMotion?: boolean;
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     {
//       className,
//       variant,
//       size,
//       asChild = false,
//       hoverScale = 1.02,
//       tapScale = 0.98,
//       disableMotion = false,
//       ...props
//     },
//     ref
//   ) => {
//     const Comp = asChild ? Slot : 'button';
//     const MotionComp = disableMotion ? Comp : motion(Comp);

//     return (
//       <MotionComp
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...props}
//         {...(!disableMotion && {
//           whileHover: { scale: hoverScale },
//           whileTap: { scale: tapScale },
//           transition: { type: 'spring', stiffness: 300 },
//           style: { transformOrigin: 'center', pointerEvents: 'auto' }, // اطمینان از فعال بودن تعاملات
//         })}
//       />
//     );
//   }
// );
// Button.displayName = 'Button';

// export { Button, buttonVariants };
"use client";

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';


const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
// const buttonVariants = cva(
//   'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
//   {
//     variants: {
//       variant: {
//         default: 'bg-primary text-primary-foreground hover:bg-primary/90',
//         destructive:
//           'bg-destructive text-destructive-foreground hover:bg-destructive/90',
//         outline:
//           'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
//         secondary:
//           'bg-secondary text-secondary-foreground hover:bg-secondary/80',
//         ghost: 'hover:bg-accent hover:text-accent-foreground',
//         link: 'text-primary underline-offset-4 hover:underline',
//       },
//       size: {
//         default: 'h-10 px-4 py-2',
//         sm: 'h-9 rounded-md px-3',
//         lg: 'h-11 rounded-md px-8',
//         icon: 'h-10 w-10',
//       },
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default',
//     },
//   }
// );

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  hoverScale?: number;
  tapScale?: number;
  disableMotion?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, hoverScale = 1.03, tapScale = 0.97, disableMotion = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    if(disableMotion)
      return (<Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />)

    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='inline-block'>
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
          {...(!disableMotion && {
          whileHover: { scale: hoverScale },
          whileTap: { scale: tapScale },
          transition: { type: 'spring', stiffness: 300 },
          style: { transformOrigin: 'center', pointerEvents: 'auto' },
        })}
        />
      </motion.div>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
// ---------------------------------------------------------------------------------------
// "use client";

// import * as React from 'react';
// import { Slot } from '@radix-ui/react-slot';
// import { cva, type VariantProps } from 'class-variance-authority';
// import { cn } from '@/lib/utils';
// import { motion } from 'framer-motion';

// const buttonVariants = cva(
//   'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
//   {
//     variants: {
//       variant: {
//         default: 'bg-primary text-primary-foreground hover:bg-primary/90',
//         destructive:
//           'bg-destructive text-destructive-foreground hover:bg-destructive/90',
//         outline:
//           'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
//         secondary:
//           'bg-secondary text-secondary-foreground hover:bg-secondary/80',
//         ghost: 'hover:bg-accent hover:text-accent-foreground',
//         link: 'text-primary underline-offset-4 hover:underline',
//       },
//       size: {
//         default: 'h-10 px-4 py-2',
//         sm: 'h-9 rounded-md px-3',
//         lg: 'h-11 rounded-md px-8',
//         icon: 'h-10 w-10',
//       },
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default',
//     },
//   }
// );

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean;
//   hoverScale?: number; // مقدار scale برای hover
//   tapScale?: number; // مقدار scale برای tap
//   disableMotion?: boolean; // غیرفعال کردن انیمیشن
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     {
//       className,
//       variant,
//       size,
//       asChild = false,
//       hoverScale = 1.03, // مقدار پیش‌فرض برای hover
//       tapScale = 0.97, // مقدار پیش‌فرض برای tap
//       disableMotion = false,
//       ...props
//     },
//     ref
//   ) => {
//     const Comp = asChild ? Slot : 'button';
//     const MotionComp = disableMotion ? Comp : motion(Comp); // اگر انیمیشن غیرفعال باشد، از Comp معمولی استفاده کن

//     return (
//       <MotionComp
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...(disableMotion
//           ? {}
//           : {
//               whileHover: { scale: hoverScale },
//               whileTap: { scale: tapScale },
//               transition: { type: 'spring', stiffness: 300 },
//               style: { transformOrigin: 'center' }, // تنظیم مبدا تغییر مقیاس
//             })}
//         {...props}
//       />
//     );
//   }
// );
// Button.displayName = 'Button';

// export { Button, buttonVariants };