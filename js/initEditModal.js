`
      <div class="edit-modal" id="editModal">
        <div class="edit-modal-content">
          <div class="edit-modal-header">
            <h2>Редагування випуску</h2>
            <button class="close-edit-modal" id="closeEditModal">×</button>
          </div>
          
          <form class="edit-form" id="editForm">
            <div class="form-section">
              <h3>Основна інформація</h3>
              <div class="form-group">
                <label for="editId">ID випуску</label>
                <input type="text" id="editId" name="id" readonly>
              </div>
              <div class="form-group">
                <label for="editCover">Обкладинка (шлях до файлу)</label>
                <input type="text" id="editCover" name="cover">
              </div>
              <div class="form-group">
                <label for="editRelease">Дата виходу</label>
                <input type="text" id="editRelease" name="release">
              </div>
              <div class="form-group">
                <label for="editPublication">Дата публікації</label>
                <input type="text" id="editPublication" name="publication">
              </div>
              <div class="form-group">
                <label for="editStoryTitle">Назва історії</label>
                <input type="text" id="editStoryTitle" name="story_title">
              </div>
              <div class="form-group">
                <label for="editEditorChief">Головний редактор</label>
                <input type="text" id="editEditorChief" name="editor_chief">
              </div>
            </div>
            
            <div class="form-section">
              <h3>Творці</h3>
              <div class="form-group">
                <label for="editWriter">Автор</label>
                <input type="text" id="editWriter" name="writer">
              </div>
              <div class="form-group">
                <label for="editPenciler">Художник</label>
                <input type="text" id="editPenciler" name="penciler">
              </div>
              <div class="form-group">
                <label for="editInker">Інкер</label>
                <input type="text" id="editInker" name="inker">
              </div>
              <div class="form-group">
                <label for="editColorist">Колорист</label>
                <input type="text" id="editColorist" name="colorist">
              </div>
              <div class="form-group">
                <label for="editLetterer">Леттерер</label>
                <input type="text" id="editLetterer" name="letterer">
              </div>
              <div class="form-group">
                <label for="editEditor">Редактор</label>
                <input type="text" id="editEditor" name="editor">
              </div>
            </div>
            
            <div class="form-section">
              <h3>Додаткові історії</h3>
              <div id="storyFormsContainer">
                <!-- Default first story form -->
                <div class="story-form" data-index="0">
                  <h4>Історія 1</h4>
                  <div class="form-group">
                    <label for="editStoryTitle2">Назва історії</label>
                    <input type="text" id="editStoryTitle2" name="story_title2">
                  </div>
                  <div class="form-group">
                    <label for="editWriter2">Автор</label>
                    <input type="text" id="editWriter2" name="writer2">
                  </div>
                  <div class="form-group">
                    <label for="editPenciler2">Художник</label>
                    <input type="text" id="editPenciler2" name="penciler2">
                  </div>
                  <div class="form-group">
                    <label for="editInker2">Інкер</label>
                    <input type="text" id="editInker2" name="inker2">
                  </div>
                  <div class="form-group">
                    <label for="editColorist2">Колорист</label>
                    <input type="text" id="editColorist2" name="colorist2">
                  </div>
                  <div class="form-group">
                    <label for="editLetterer2">Леттерер</label>
                    <input type="text" id="editLetterer2" name="letterer2">
                  </div>
                  <div class="form-group">
                    <label for="editEditor2">Редактор</label>
                    <input type="text" id="editEditor2" name="editor2">
                  </div>
                </div>
              </div>
              <button type="button" class="add-story-button" id="addStoryButton">+ Додати історію</button>
            </div>
            
            <div class="form-actions">
              <button type="button" class="cancel-button" id="cancelEdit">Скасувати</button>
              <button type="submit" class="save-button">Зберегти</button>
            </div>
          </form>
        </div>
      </div>
      `
      
  setupModalHandlers(data)
  setupTabs()