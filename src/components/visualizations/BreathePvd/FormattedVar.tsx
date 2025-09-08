import { BreatheSensorViewerVars, PmSensorVariable } from '@/utils/data/api/breathe-pvd';

export function FormattedVar(variable: BreatheSensorViewerVars | PmSensorVariable) {
  if (variable === 'co') return <>CO (ppm)</>;
  if (variable === 'co2')
    return (
      <>
        CO<sub>2</sub> (ppm)
      </>
    );
  if (variable === 'pm1')
    return (
      <>
        PM<sub>1</sub>
      </>
    );
  if (variable === 'pm25')
    return (
      <>
        PM<sub>2.5</sub>
      </>
    );
  if (variable === 'pm10')
    return (
      <>
        PM<sub>10</sub>
      </>
    );
}
