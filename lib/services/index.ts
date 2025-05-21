import AuthService from "./auth-service"
import CoachService from "./coach-service"
import AlunoService from "./aluno-service"
import PlanoService from "./plano-service"
import AssinaturaService from "./assinatura-service"
import FeedbackService from "./feedback-service"
import AnamneseService from "./anamnese-service"
import TreinoService from "./treino-service"
import AlimentarService from "./alimentar-service"

export {
  AuthService,
  CoachService,
  AlunoService,
  PlanoService,
  AssinaturaService,
  FeedbackService,
  AnamneseService,
  TreinoService,
  AlimentarService,
}

export type { LoginRequest, RegisterCoachRequest, RegisterAlunoRequest } from "./auth-service"
