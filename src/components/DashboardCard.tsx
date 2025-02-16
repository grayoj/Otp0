'use client';

import React from 'react';
import { Card, CardTitle } from '@otp0/components/ui/card';
import { DashboardCardProps } from '@otp0/constants/types';

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  description,
}) => {
  return (
    <Card className="p-4 flex items-center justify-between bg-background">
      <div className="space-y-1">
        <CardTitle className="text-lg font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        <p className="text-4xl font-bold mt-2">{value}</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full text-primary">
        {icon}
      </div>
    </Card>
  );
};

export default DashboardCard;
