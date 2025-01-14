package repository

import "github.com/vermacodes/one-click-aks/app/server/entity"

type actionStatusRepository struct{}

func NewActionStatusRepository() entity.ActionStatusRepository {
	return &actionStatusRepository{}
}

func (a *actionStatusRepository) GetActionStatus() (string, error) {
	return getRedis("actionstatus")
}
func (a *actionStatusRepository) SetActionStatus(val string) error {
	return setRedis("actionstatus", val)
}

func (a *actionStatusRepository) SetTerraformOperation(id string, val string) error {
	return setRedis(id, val)
}

func (a *actionStatusRepository) GetTerraformOperation(id string) (string, error) {
	return getRedis(id)
}
