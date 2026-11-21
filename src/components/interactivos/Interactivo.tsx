import 'mafs/core.css'
import { validarInteractivo, type InteractivoSpec } from '../../lib/interactivo'
import Circulo from './Circulo'
import Limite from './Limite'
import Pendiente from './Pendiente'
import Secante from './Secante'

/** Bloque ```interactivo de una entrada: elige el componente según "tipo". */
export default function Interactivo({ json }: { json: string }) {
  let spec: InteractivoSpec
  try {
    spec = JSON.parse(json)
  } catch (err) {
    return <Aviso errores={[`El JSON del bloque está mal escrito: ${(err as Error).message}`]} />
  }
  const errores = validarInteractivo(spec)
  if (errores.length) return <Aviso errores={errores} />
  switch (spec.tipo) {
    case 'circulo-unitario':
      return <Circulo spec={spec} />
    case 'limite':
      return <Limite spec={spec} />
    case 'secante':
      return <Secante spec={spec} />
    case 'pendiente':
      return <Pendiente spec={spec} />
  }
}

function Aviso({ errores }: { errores: string[] }) {
  return (
    <div role="alert" className="my-3 rounded-md border-2 border-red-600 bg-red-50 p-3 text-sm text-red-900 dark:bg-red-950 dark:text-red-100">
      <p className="font-bold">Bloque interactivo con problemas</p>
      <ul className="ml-5 list-disc">
        {errores.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  )
}
