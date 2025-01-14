package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/vermacodes/one-click-aks/app/server/entity"
)

type terraformHandler struct {
	terraformService entity.TerraformService
}

func NewTerraformHandler(r *gin.RouterGroup, service entity.TerraformService) {
	handler := &terraformHandler{
		terraformService: service,
	}

	r.POST("/init", handler.Init)
	r.POST("/plan", handler.Plan)
	r.POST("/apply", handler.Apply)
	r.POST("/applyasync", handler.ApplyAsync)
	r.POST("/destroy", handler.Destroy)
	r.POST("/destroyasync", handler.DestroyAsync)
	r.POST("/apply/extend", handler.ApplyExtend)
	r.POST("/applyasync/extend", handler.ApplyAsyncExtend)
	r.POST("/destroy/extend", handler.DestroyExtend)
	r.POST("/destroyasync/extend", handler.DestroyAsyncExtend)
	r.POST("/validate", handler.Validate)
}

func (t *terraformHandler) Init(c *gin.Context) {

	w := c.Writer
	header := w.Header()
	header.Set("Transfer-Encoding", "chunked")
	header.Set("Content-type", "text/html")
	w.WriteHeader(http.StatusOK)
	w.(http.Flusher).Flush()

	t.terraformService.Init()
}

func (t *terraformHandler) Plan(c *gin.Context) {
	lab := entity.LabType{}
	if err := c.Bind(&lab); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	w := c.Writer
	header := w.Header()
	header.Set("Transfer-Encoding", "chunked")
	header.Set("Content-type", "text/html")
	w.WriteHeader(http.StatusOK)
	w.(http.Flusher).Flush()

	t.terraformService.Plan(lab)
}

func (t *terraformHandler) Apply(c *gin.Context) {
	lab := entity.LabType{}
	if err := c.Bind(&lab); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	w := c.Writer
	header := w.Header()
	header.Set("Transfer-Encoding", "chunked")
	header.Set("Content-type", "text/html")
	// w.WriteHeader(http.StatusOK)

	if err := t.terraformService.Apply(lab); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	} else {
		w.WriteHeader(http.StatusOK)
	}

	w.(http.Flusher).Flush()
}

func (t *terraformHandler) ApplyAsync(c *gin.Context) {
	lab := entity.LabType{}
	if err := c.Bind(&lab); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	terraformOperation, err := t.terraformService.ApplyAsync(lab)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.IndentedJSON(http.StatusAccepted, terraformOperation)
}

func (t *terraformHandler) ApplyExtend(c *gin.Context) {
	lab := entity.LabType{}
	if err := c.Bind(&lab); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	w := c.Writer
	header := w.Header()
	header.Set("Transfer-Encoding", "chunked")
	header.Set("Content-type", "text/html")

	if err := t.terraformService.Extend(lab, "apply"); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	} else {
		w.WriteHeader(http.StatusOK)
	}

	w.(http.Flusher).Flush()
}

func (t *terraformHandler) ApplyAsyncExtend(c *gin.Context) {
	lab := entity.LabType{}
	if err := c.Bind(&lab); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	terraformOperation, err := t.terraformService.ExtendAsync(lab, "apply")
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.IndentedJSON(http.StatusAccepted, terraformOperation)
}

func (t *terraformHandler) DestroyExtend(c *gin.Context) {
	lab := entity.LabType{}
	if err := c.Bind(&lab); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	w := c.Writer
	header := w.Header()
	header.Set("Transfer-Encoding", "chunked")
	header.Set("Content-type", "text/html")

	if err := t.terraformService.Extend(lab, "destroy"); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	} else {
		w.WriteHeader(http.StatusOK)
	}

	w.(http.Flusher).Flush()
}

func (t *terraformHandler) Destroy(c *gin.Context) {
	lab := entity.LabType{}
	if err := c.Bind(&lab); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	w := c.Writer
	header := w.Header()
	header.Set("Transfer-Encoding", "chunked")
	header.Set("Content-type", "text/html")
	w.WriteHeader(http.StatusOK)
	w.(http.Flusher).Flush()

	t.terraformService.Destroy(lab)
}

func (t *terraformHandler) DestroyAsync(c *gin.Context) {
	lab := entity.LabType{}
	if err := c.Bind(&lab); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	terraformOperation, err := t.terraformService.DestroyAsync(lab)
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.IndentedJSON(http.StatusAccepted, terraformOperation)
}

func (t *terraformHandler) DestroyAsyncExtend(c *gin.Context) {
	lab := entity.LabType{}
	if err := c.Bind(&lab); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	terraformOperation, err := t.terraformService.ExtendAsync(lab, "destroy")
	if err != nil {
		c.Status(http.StatusInternalServerError)
		return
	}

	c.IndentedJSON(http.StatusAccepted, terraformOperation)
}

func (t *terraformHandler) Validate(c *gin.Context) {
	lab := entity.LabType{}
	if err := c.Bind(&lab); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	w := c.Writer
	header := w.Header()
	header.Set("Transfer-Encoding", "chunked")
	header.Set("Content-type", "text/html")
	w.WriteHeader(http.StatusOK)

	if err := t.terraformService.Extend(lab, "validate"); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	} else {
		w.WriteHeader(http.StatusOK)
	}

	w.(http.Flusher).Flush()
}
